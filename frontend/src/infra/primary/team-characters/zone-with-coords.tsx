type ZoneTooltipProps = {
  mapName: string;
  x: number;
  y: number;
};

const ZoneWithCoords: React.FC<ZoneTooltipProps> = ({ mapName, x, y }) => {
  return (
    <span className="zone-tooltip-wrapper">
      {mapName}
      <span className="zone-tooltip">
        X: {x.toFixed(1)}
        <br />
        Y: {y.toFixed(1)}
      </span>
    </span>
  );
};

export default ZoneWithCoords;
