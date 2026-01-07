import type React from "react";
import type { RushProgressionRepository } from "../../../domain/port/rush-progression-repository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  rushProgressionRepository: RushProgressionRepository;
  rushName: string;
};

export const Progression: React.FC<Props> = ({
  rushProgressionRepository,
  rushName,
}) => {
  const { data } = useQuery({
    queryKey: ["rush-progression", rushName],
    queryFn: () => rushProgressionRepository.findByName(rushName),
    refetchInterval: 15_000,
    staleTime: 15_000,
    enabled: !!rushName,
  });

  const { t } = useTranslation();

  const progressions = useMemo(() => {
    if (!data) return [];
    return [...data.progressions].sort((a, b) =>
      a.playerName.localeCompare(b.playerName)
    );
  }, [data]);

  if (!data) return null;

  return (
    <div className="surface-scroll">
      <div className="surface-scroll-body">
        <table className="table-wow">
          <thead>
            <tr>
              <th className="col-player">{t("player")}</th>
              <th className="col-items">{t("achievements")}</th>
            </tr>
          </thead>
          <tbody>
            {progressions.map((p) => (
              <tr key={p.playerName}>
                <td className="col-player cell-muted">{p.playerName}</td>
                <td className="col-items">
                  <div className="item-list">
                    {p.achievements.map((a, idx) => (
                      <span key={idx} className="item-chip">
                        {t(a)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
