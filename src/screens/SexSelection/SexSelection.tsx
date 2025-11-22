import { useState } from "react";
import type { Sex } from "@/types";
import { useAuth } from "@/providers/auth";
import {
  SEX_SELECTION_TEXT,
  SEX_VALUES,
  SEX_LABELS,
  SEX_EMOJIS,
  LOG_MESSAGES,
} from "@/constants";
import styles from "./SexSelection.module.scss";

const SexSelection = (): JSX.Element => {
  const { createUser, clearError } = useAuth();
  const [selectedSex, setSelectedSex] = useState<Sex | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();
    setValidationError("");

    if (!selectedSex) {
      setValidationError(SEX_SELECTION_TEXT.VALIDATION_SELECT_SEX);
      return;
    }

    if (!name.trim()) {
      setValidationError(SEX_SELECTION_TEXT.VALIDATION_ENTER_NAME);
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser({
        name: name.trim(),
        sex: selectedSex,
      });
    } catch (error) {
      // Error is handled by auth context
      console.error(LOG_MESSAGES.FAILED_TO_CREATE_USER, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{SEX_SELECTION_TEXT.TITLE}</h1>
        <p className={styles.subtitle}>
          {SEX_SELECTION_TEXT.SUBTITLE}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameInput}>
            <input
              type="text"
              placeholder={SEX_SELECTION_TEXT.NAME_PLACEHOLDER}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError();
                setValidationError("");
              }}
              className={styles.input}
            />
          </div>

          <div className={styles.sexOptions}>
            <button
              type="button"
              onClick={() => {
                setSelectedSex(SEX_VALUES.MAN);
                clearError();
                setValidationError("");
              }}
              className={`${styles.sexButton} ${
                selectedSex === SEX_VALUES.MAN ? styles.selected : ""
              }`}
            >
              <span className={styles.emoji}>{SEX_EMOJIS.MAN}</span>
              <span className={styles.label}>{SEX_LABELS.MAN}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedSex(SEX_VALUES.WOMAN);
                clearError();
                setValidationError("");
              }}
              className={`${styles.sexButton} ${
                selectedSex === SEX_VALUES.WOMAN ? styles.selected : ""
              }`}
            >
              <span className={styles.emoji}>{SEX_EMOJIS.WOMAN}</span>
              <span className={styles.label}>{SEX_LABELS.WOMAN}</span>
            </button>
          </div>

          {validationError && (
            <div className={styles.error}>{validationError}</div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !selectedSex || !name.trim()}
          >
            {isSubmitting ? SEX_SELECTION_TEXT.BUTTON_CREATING : SEX_SELECTION_TEXT.BUTTON_CONTINUE}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SexSelection;
