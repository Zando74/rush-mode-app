import type React from "react";
import type { RushCharactersRepository } from "../../../domain/port/rush-characters-repository";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { maps } from "../../secondary/data/map";
import ZoneWithCoords from "./zone-with-coords";

type Props = {
  rushCharactersRepository: RushCharactersRepository;
  rushName: string;
};

export const TeamCharacters: React.FC<Props> = ({
  rushCharactersRepository,
  rushName,
}) => {
  const { data } = useQuery({
    queryKey: ["rush-characters", rushName],
    queryFn: () => rushCharactersRepository.findByName(rushName),
    refetchInterval: 15_000,
    staleTime: 15_000,
    enabled: !!rushName,
  });

  const { t } = useTranslation();

  const teams = useMemo(() => {
    if (!data) return {};
    return data.characters.reduce<Record<string, typeof data.characters>>(
      (acc, c) => {
        acc[c.team] ??= [];
        acc[c.team].push(c);
        return acc;
      },
      {}
    );
  }, [data]);

  const teamList = useMemo(() => Object.keys(teams).sort(), [teams]);
  const [activeTeam, setActiveTeam] = useState<string | null>(null);

  // Réinitialise activeTeam si l'équipe n'existe plus
  useEffect(() => {
    if (!activeTeam || !teams[activeTeam]) {
      setActiveTeam(teamList[0] ?? null);
    }
  }, [teamList, teams, activeTeam]);

  const characters = useMemo(() => {
    if (!activeTeam || !teams[activeTeam]) return [];
    return [...teams[activeTeam]]
      .sort((a, b) => b.level - a.level)
      .sort((a, b) => Number(a.isDead) - Number(b.isDead));
  }, [teams, activeTeam]);

  if (!data || !activeTeam || !teams[activeTeam] || characters.length === 0)
    return (
      <div className="surface-scroll flex items-center justify-center text-amber-300">
        {t("noTeamData")}
      </div>
    );

  return (
    <div className="surface-scroll">
      <div className="tabs-compact">
        {teamList.map((team) => (
          <button
            key={team}
            onClick={() => setActiveTeam(team)}
            className={`tab-compact ${
              activeTeam === team ? "tab-compact-active" : ""
            }`}
          >
            {team}
          </button>
        ))}
      </div>

      {/* Scrollable table */}
      <div className="surface-scroll-body">
        <table className="table-wow">
          <thead>
            <tr>
              <th className="col-char">{t("character")}</th>
              <th className="col-player">{t("player")}</th>
              <th className="col-class">{t("class")}</th>
              <th className="col-lvl">{t("level")}</th>
              <th className="col-class">Zone</th>
              <th className="col-gold">{t("gold")}</th>
              <th className="col-professions">{t("profession")}</th>
              <th className="col-items">{t("items")}</th>
            </tr>
          </thead>

          <tbody>
            {characters.map((c) => (
              <tr key={c.characterId} className={c.isDead ? "row-dead" : ""}>
                <td className="col-char">
                  {c.characterName}-{c.characterId}
                </td>
                <td className="col-player cell-muted">{c.playerName}</td>
                <td className="col-class cell-muted">
                  {t("class-" + c.classId)}
                </td>
                <td className="col-lvl cell-level">{c.level}</td>
                <td className="col-map cell-muted">
                  <ZoneWithCoords mapName={maps[c.mapId]} x={c.x} y={c.y} />
                </td>
                <td className="col-gold cell-muted">
                  {(c.moneyInCopper / 10000).toFixed(1)}g
                </td>
                <td className="col-professions">
                  <div className="profession-list">
                    {c.professions.map((p) => (
                      <span key={p.professionId} className="profession-chip">
                        {t("prof-" + p.professionId)} : {p.level}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="col-items">
                  <div className="item-list">
                    {c.itemIds.map((id) => (
                      <span key={id} className="item-chip">
                        <a
                          href={t("wowheadItem") + id}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          id:{id}
                        </a>
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
