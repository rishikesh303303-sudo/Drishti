"""
File: app/blockchain/hash_utils.py
Two functions: compute a record's hash, and anchor it on-chain.

NOT called by any router yet — routers/audit.py (File 10) currently
computes its own inline hash and always resolves match=True as a demo
shortcut. Wire these two functions in once you actually stand up a
permissioned Hyperledger Fabric network.
"""
import hashlib
import json
from typing import Dict


def compute_hash(record: Dict) -> str:
    """
    Deterministic hash of a record. Used BOTH when a record is first
    anchored AND every time it's re-verified later — so it must use the
    exact same field set and key ordering both times, or hashes will
    never match even when nothing actually changed.

    sort_keys=True handles ordering; field set is your responsibility —
    always pass the same dict shape in, e.g. only the fields that were
    present when the record was originally anchored, never extra fields
    added later.
    """
    serialized = json.dumps(record, sort_keys=True).encode("utf-8")
    return hashlib.sha256(serialized).hexdigest()


def anchor_hash(record_hash: str, metadata: Dict) -> str:
    """
    Submits `record_hash` + minimal metadata (record_type, timestamp,
    linked_case_id — never raw complaint/account data) to the permissioned
    Hyperledger Fabric chaincode, and returns the transaction ID to store
    in AuditRecord.tx_id.

    Stubbed to return a fake tx ID until a real Fabric network exists —
    everything else in the app (routers/audit.py's list/verify endpoints)
    works identically either way, since they only ever read the returned
    tx_id and hash, never talk to Fabric directly themselves.
    """
    # TODO: replace with a real Fabric SDK call, e.g.:
    #   from hfc.fabric import Client
    #   client = Client(net_profile="network.json")
    #   response = client.chaincode_invoke(..., args=[record_hash, json.dumps(metadata)])
    #   return response["tx_id"]
    fake_tx_id = f"0xFAKE{record_hash[:10]}"
    return fake_tx_id


def verify_hash(stored_record: Dict, on_chain_hash: str) -> bool:
    """
    Recomputes the hash from the current off-chain record and compares it
    to the hash that was anchored on-chain. This is what routers/audit.py's
    /verify endpoint should call once Fabric is real — replacing its
    current always-true placeholder.
    """
    recomputed = compute_hash(stored_record)
    return recomputed == on_chain_hash