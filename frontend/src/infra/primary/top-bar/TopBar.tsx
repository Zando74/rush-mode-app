import type React from "react";
import type { RushNamesRepository } from "../../../domain/port/rush-names-repository";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import i18n from "../../../i18n";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TopBar: React.FC<{
  rushNamesRepository: RushNamesRepository;
  rushName: string;
  setRushName: React.Dispatch<React.SetStateAction<string>>;
}> = ({ rushNamesRepository, rushName, setRushName }) => {
  const [openLangMenu, setOpenLangMenu] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: rushNames } = useQuery({
    queryKey: ["rush-names"],
    queryFn: () => rushNamesRepository.findAllNames(),
  });

  useEffect(() => {
    if (rushNames?.length && rushName === "") {
      setRushName(rushNames[0]);
    }
  }, [rushNames, rushName, setRushName]);

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setOpenLangMenu(false);
    });
  };

  return (
    <header className="topbar">
      <div className="topbar-container">
        <h1 className="topbar-title">
          <span>⚔️</span>

          <span className="whitespace-nowrap">
            Rush Mode
            <span className="mx-2 text-amber-500/40">•</span>
            {t("players tracking")}
          </span>

          <select
            className="select-wow max-w-[180px]"
            value={rushName}
            onChange={(e) => {
              setRushName(e.target.value);
              setTimeout(() => queryClient.invalidateQueries(), 500);
            }}
          >
            {rushNames?.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </h1>

        <div className="relative">
          <button
            onClick={() => setOpenLangMenu((p) => !p)}
            className="icon-button"
          >
            <BookOpen size={18} />
          </button>

          {openLangMenu && (
            <div className="dropdown">
              <button
                onClick={() => changeLang("fr")}
                className="dropdown-item"
              >
                🇫🇷 Français
              </button>
              <button
                onClick={() => changeLang("en")}
                className="dropdown-item"
              >
                🇬🇧 English
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
