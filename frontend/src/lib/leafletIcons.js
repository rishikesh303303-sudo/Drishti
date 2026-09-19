import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

export function riskIcon(tone) {
  const color = tone === "critical" ? "#ed147d" : tone === "medium" ? "#6337ec" : "#16a8eb";
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 22px; height: 22px; border-radius: 50%;
      background: ${color}; box-shadow: 0 0 0 5px ${color}33, 0 3px 8px #4355;
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export function riskIconWithStatus(tone, activeStatus) {
  const color = tone === "critical" ? "#ed147d" : tone === "medium" ? "#6337ec" : "#16a8eb";

  let badge = "";
  if (activeStatus === "dispatched") {
    badge = `<div style="
      position: absolute; top: -8px; right: -8px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #ffa70f; display: flex; align-items: center; justify-content: center;
      font-size: 10px; box-shadow: 0 0 0 2px white;
    ">🚓</div>`;
  } else if (activeStatus === "actioned") {
    badge = `<div style="
      position: absolute; top: -8px; right: -8px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #16c47f; display: flex; align-items: center; justify-content: center;
      font-size: 10px; color: white; box-shadow: 0 0 0 2px white;
    ">✓</div>`;
  }

  return L.divIcon({
    className: "",
    html: `<div style="position: relative; width: 22px; height: 22px;">
      <div style="
        width: 22px; height: 22px; border-radius: 50%;
        background: ${color}; box-shadow: 0 0 0 5px ${color}33, 0 3px 8px #4355;
      "></div>
      ${badge}
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}