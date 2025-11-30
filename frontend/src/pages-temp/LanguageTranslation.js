import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

function LanguageTranslation() {
  const { language, changeLanguage } = useContext(LanguageContext);

  return (
    <div>
      <h2>Choose Language</h2>

      <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
        <option value="English">English</option>
        <option value="Kannada">Kannada</option>
      </select>

      <p>Selected Language: {language}</p>
    </div>
  );
}

export default LanguageTranslation;
