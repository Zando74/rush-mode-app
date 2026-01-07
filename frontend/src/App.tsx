import { useState } from "react";
import { Audit } from "./infra/primary/audit/audit";
import { Fraud } from "./infra/primary/fraud/fraud";
import { Progression } from "./infra/primary/progression/progression";
import { TeamCharacters } from "./infra/primary/team-characters/team-characters";
import { RushCharactersRepositoryImpl } from "./infra/secondary/repository/rush-characters-repository-impl";
import { RushFraudRepositoryImpl } from "./infra/secondary/repository/rush-fraud-repository-impl";
import { RushProgressionRepositoryImpl } from "./infra/secondary/repository/rush-progression-repository-impl";
import WebService from "./infra/secondary/rest/web-service";
import { TopBar } from "./infra/primary/top-bar/TopBar";
import { RushNamesRepositoryImpl } from "./infra/secondary/repository/rush-names-repository-impl";
import { useTranslation } from "react-i18next";

function App() {
  const [rushName, setRushName] = useState("");
  const { t } = useTranslation();

  const webService = new WebService(
    import.meta.env.VITE_BACKEND_URL,
    import.meta.env.VITE_API_KEY
  );

  const rushNamesRepository = new RushNamesRepositoryImpl(webService);
  const rushCharactersRepository = new RushCharactersRepositoryImpl(webService);
  const rushFraudRepository = new RushFraudRepositoryImpl(webService);
  const rushProgressionRepository = new RushProgressionRepositoryImpl(
    webService
  );

  return (
    <div className="app-container">
      {/* TopBar reste sticky */}
      <TopBar
        rushNamesRepository={rushNamesRepository}
        rushName={rushName}
        setRushName={setRushName}
      />

      {/* Explication */}
      <p className="text-amber-200 text-sm justify-center text-center pt-2">
        {t("brief")}{" "}
        <a
          href="https://wow.kametotv.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-yellow-400"
        >
          wow.kametotv.fr
        </a>
        <br />
        {t("detail")}
      </p>

      {/* Dashboard grid */}
      <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-4">
        <div className="dashboard-panel">
          <div className="dashboard-content">
            <h2 className="dashboard-title">{t("teamTracking")}</h2>
            <TeamCharacters
              rushCharactersRepository={rushCharactersRepository}
              rushName={rushName}
            />
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-content">
            <h2 className="dashboard-title">{t("achivementsDone")}</h2>
            <Progression
              rushProgressionRepository={rushProgressionRepository}
              rushName={rushName}
            />
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-content">
            <h2 className="dashboard-title">{t("fraudSuspicion")}</h2>
            <Fraud
              rushFraudRepository={rushFraudRepository}
              rushName={rushName}
            />
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-content">
            <h2 className="dashboard-title">{t("lastHourEvents")}</h2>
            <Audit
              rushCharactersRepository={rushCharactersRepository}
              rushName={rushName}
            />
          </div>
        </div>
      </div>

      {/* Footer aligné à droite */}
      <div className="flex justify-center items-center gap-4 px-4">
        <span className="text-l font-bold text-amber-300">
          <a
            href="https://www.buymeacoffee.com/zandodev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400 font-semibold"
          >
            ☕ Buy me a coffee
          </a>
        </span>
        -
        <span className="text-l font-bold text-amber-300">
          <a
            href="https://www.curseforge.com/wow/addons/rush-mode"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            📦 Addon
          </a>
        </span>
        -
        <span className="text-l font-bold text-amber-300">
          <a
            href="https://github.com/Zando74/rush-mode-app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-400"
          >
            📄 Sources & Documentations
          </a>
        </span>
      </div>
    </div>
  );
}

export default App;
