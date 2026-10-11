import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  QuestionnaireAnswers,
  SpaceUploadMetadata,
  AIAnalysisResult,
} from '../types/energy';
import {
  DEFAULT_QUESTIONNAIRE,
  DEFAULT_UPLOAD_METADATA,
  buildCompleteAnalysis,
} from '../data/fallbackAnalysis';
import sampleTerraceImg from '../assets/images/sample_terrace_rooftop_1791529316071.jpg';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  questionnaire: QuestionnaireAnswers;
  setQuestionnaire: React.Dispatch<React.SetStateAction<QuestionnaireAnswers>>;
  uploadMetadata: SpaceUploadMetadata;
  setUploadMetadata: React.Dispatch<React.SetStateAction<SpaceUploadMetadata>>;
  analysisResult: AIAnalysisResult;
  setAnalysisResult: React.Dispatch<React.SetStateAction<AIAnalysisResult>>;
  hasCompletedAnalysis: boolean;
  setHasCompletedAnalysis: (val: boolean) => void;
  resetDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'greenspace_ai_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.user || null;
      }
    } catch {
      // ignore storage errors
    }
    return null;
  });

  const [questionnaire, setQuestionnaire] = useState<QuestionnaireAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.questionnaire) return parsed.questionnaire;
      }
    } catch {
      // ignore
    }
    return DEFAULT_QUESTIONNAIRE;
  });

  const [uploadMetadata, setUploadMetadata] = useState<SpaceUploadMetadata>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.uploadMetadata && parsed.uploadMetadata.imagePreviewUrl) {
          return parsed.uploadMetadata;
        }
      }
    } catch {
      // ignore
    }
    return {
      ...DEFAULT_UPLOAD_METADATA,
      imagePreviewUrl: sampleTerraceImg,
    };
  });

  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.analysisResult) return parsed.analysisResult;
      }
    } catch {
      // ignore
    }
    return buildCompleteAnalysis(DEFAULT_QUESTIONNAIRE, {
      ...DEFAULT_UPLOAD_METADATA,
      imagePreviewUrl: sampleTerraceImg,
    });
  });

  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.hasCompletedAnalysis);
      }
    } catch {
      // ignore
    }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          questionnaire,
          uploadMetadata: {
            ...uploadMetadata,
            // avoid exceeding localStorage quota with huge base64 if > 1.5MB
            imagePreviewUrl:
              uploadMetadata.imagePreviewUrl && uploadMetadata.imagePreviewUrl.length < 1500000
                ? uploadMetadata.imagePreviewUrl
                : sampleTerraceImg,
          },
          analysisResult,
          hasCompletedAnalysis,
        })
      );
    } catch {
      // ignore quota errors
    }
  }, [user, questionnaire, uploadMetadata, analysisResult, hasCompletedAnalysis]);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const resetDemoState = () => {
    const defaultMeta = {
      ...DEFAULT_UPLOAD_METADATA,
      imagePreviewUrl: sampleTerraceImg,
    };
    setQuestionnaire(DEFAULT_QUESTIONNAIRE);
    setUploadMetadata(defaultMeta);
    setAnalysisResult(buildCompleteAnalysis(DEFAULT_QUESTIONNAIRE, defaultMeta));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        questionnaire,
        setQuestionnaire,
        uploadMetadata,
        setUploadMetadata,
        analysisResult,
        setAnalysisResult,
        hasCompletedAnalysis,
        setHasCompletedAnalysis,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
