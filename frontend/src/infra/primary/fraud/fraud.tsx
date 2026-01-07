import type React from "react";
import type { RushFraudRepository } from "../../../domain/port/rush-fraud-repository";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  rushFraudRepository: RushFraudRepository;
  rushName: string;
};

export const Fraud: React.FC<Props> = ({ rushFraudRepository, rushName }) => {
  const { data } = useQuery({
    queryKey: ["rush-fraud", rushName],
    queryFn: () => rushFraudRepository.findByName(rushName),
    refetchInterval: 15_000,
    staleTime: 15_000,
    enabled: !!rushName,
  });

  const { t } = useTranslation();

  const mails = useMemo(() => data?.mails ?? [], [data]);
  const trades = useMemo(() => data?.trades ?? [], [data]);

  const [activeTab, setActiveTab] = useState<"mails" | "trades">("mails");

  if (!data) return null;

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleString();

  return (
    <div className="flex flex-col gap-2 surface-scroll">
      <div className="tabs-compact surface">
        <button
          className={`tab-compact ${
            activeTab === "mails" ? "tab-compact-active" : ""
          }`}
          onClick={() => setActiveTab("mails")}
        >
          {t("mails")}
        </button>
        <button
          className={`tab-compact ${
            activeTab === "trades" ? "tab-compact-active" : ""
          }`}
          onClick={() => setActiveTab("trades")}
        >
          {t("trades")}
        </button>
      </div>

      {/* Table */}
      {activeTab === "mails" && (
        <div className="surface-scroll">
          <div className="surface-scroll-body">
            <table className="table-wow">
              <thead>
                <tr>
                  <th className="col-player">{t("player")}</th>
                  <th className="col-player">{t("sender")}</th>
                  <th className="col-gold">{t("Gold Taken")}</th>
                  <th className="col-items">{t("Attachments")}</th>
                  <th className="col-lvl">Date</th>
                </tr>
              </thead>
              <tbody>
                {mails.map((m, idx) => (
                  <tr key={`${m.playerName}-${idx}`}>
                    <td className="col-player cell-muted">{m.playerName}</td>
                    <td className="col-player cell-muted">{m.sender}</td>
                    <td className="col-gold cell-level">
                      {(m.goldTaken / 10000).toFixed(1)}g
                    </td>
                    <td className="col-items">
                      <div className="item-list">
                        {m.attachments.map((a) => (
                          <span key={a.id} className="item-chip">
                            <a
                              href={t("wowheadItem") + a.id}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              id:{a.id}×{a.quantity}
                            </a>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="col-lvl cell-muted">
                      {formatDate(m.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "trades" && (
        <div className="surface-scroll">
          <div className="surface-scroll-body">
            <table className="table-wow">
              <thead>
                <tr>
                  <th className="col-player">{t("player")}</th>
                  <th className="col-player">{t("giver")}</th>
                  <th className="col-gold">{t("Gold Taken")}</th>
                  <th className="col-items">{t("Items")}</th>
                  <th className="col-lvl">Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((tr, idx) => (
                  <tr key={`${tr.playerName}-${idx}`}>
                    <td className="col-player cell-muted">{tr.playerName}</td>
                    <td className="col-player cell-muted">{tr.giver}</td>
                    <td className="col-gold cell-level">
                      {(tr.goldReceived / 10000).toFixed(1)}g
                    </td>
                    <td className="col-items">
                      <div className="item-list">
                        {tr.items.map((a) => (
                          <span key={a.id} className="item-chip">
                            <a
                              href={t("wowheadItem") + a.id}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              id:{a.id}×{a.quantity}
                            </a>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="col-lvl cell-muted">
                      {formatDate(tr.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
