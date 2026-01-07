import type React from "react";
import type { RushCharactersRepository } from "../../../domain/port/rush-characters-repository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EventTypeEnum } from "../../../domain/type/event-type-enum";

export type RushCharactersEvent = {
  characterId: string;
  events: {
    type: string;
    data: Record<string, unknown>;
    sequenceNumber: number;
    at: Date;
  }[];
};

type Props = {
  rushCharactersRepository: RushCharactersRepository;
  rushName: string;
};

export const Audit: React.FC<Props> = ({
  rushCharactersRepository,
  rushName,
}) => {
  const { t } = useTranslation();

  function useRushCharactersEvents(
    rushCharactersRepository: RushCharactersRepository,
    rushName: string
  ) {
    return useQuery<RushCharactersEvent[]>({
      queryKey: ["rush-characters-events", rushName],
      queryFn: () => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 3600_000);
        return rushCharactersRepository.findEventsByName(
          rushName,
          oneHourAgo,
          now
        );
      },
      refetchInterval: 15_000,
      staleTime: 15_000,
      enabled: !!rushName,
    });
  }

  const { data } = useRushCharactersEvents(rushCharactersRepository, rushName);

  // Flatten all events into a single array, tri par date décroissante
  const events = useMemo(() => {
    if (!data) return [];
    return data
      .flatMap((charEvent: RushCharactersEvent) =>
        charEvent.events.map((ev) => ({
          characterId: charEvent.characterId,
          type: ev.type,
          at: new Date(ev.at),
          sequenceNumber: ev.sequenceNumber,
        }))
      )
      .sort((a, b) => b.at.getTime() - a.at.getTime());
  }, [data]);

  if (!data) return null;

  const formatDate = (date: Date) => date.toLocaleString();

  return (
    <div className="surface-scroll">
      <div className="surface-scroll-body">
        <table className="table-wow">
          <thead>
            <tr>
              <th className="col-lvl">Date</th>
              <th className="col-char">{t("characterId")}</th>
              <th className="col-items">{t("eventType")}</th>
            </tr>
          </thead>
          <tbody>
            {events
              .filter(
                (ev) =>
                  ev.type !== EventTypeEnum.CharacterStatusUpdatedEventType
              )
              .map((ev, idx) => (
                <tr key={`${ev.characterId}-${ev.sequenceNumber}-${idx}`}>
                  <td className="col-lvl cell-muted">{formatDate(ev.at)}</td>
                  <td className="col-char cell-muted">{ev.characterId}</td>
                  <td className="col-items cell-level">{t(ev.type)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
