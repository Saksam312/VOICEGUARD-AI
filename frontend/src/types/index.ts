export interface SignalBreakdown {
  deepfake_score: number;
  acoustic_anomaly: number;
  prosody_anomaly: number;
  speaker_match_score: number;
  replay_probability: number;
  context_risk_score: number;
  uncertainty: number;
}

export interface AudioMetrics {
  snr_db: number;
  speech_duration_sec: number;
  latency_ms: number;
}

export interface AudioAnalysisResponse {
  call_id: string;
  timestamp_offset: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  signals: SignalBreakdown;
  uncertainty_category: string;
  explanations: string[];
  recommended_action: string;
  audio_metrics: AudioMetrics;
}

export interface CallTimelineItem {
  timestamp_offset: string;
  risk_score: number;
  risk_level: string;
  primary_signal: string;
  explanations: string[];
  recommended_action: string;
}

export interface CallSummary {
  call_id: string;
  caller_id?: string;
  start_time: string;
  status: string;
  final_risk_score: number;
  risk_level: string;
  language: string;
  is_demo: boolean;
}

export interface SpeakerProfile {
  speaker_id: string;
  name: string;
  role_or_title?: string;
  sample_count: number;
  registered_at: string;
}

export interface ModelRegistryItem {
  model_id: string;
  name: string;
  version: string;
  architecture: string;
  dataset_version: string;
  status: string;
  features_list: string[];
  metrics_json: Record<string, any>;
  created_at: string;
}

export interface ModelEvaluationItem {
  model_id: string;
  dataset_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  eer: number;
  far: number;
  frr: number;
  avg_latency_ms: number;
}

export interface AttackTestResponse {
  test_id: string;
  attack_type: string;
  sample_name: string;
  detected_risk_score: number;
  detected_level: string;
  is_correct: boolean;
  signals: SignalBreakdown;
  explanations: string[];
}

export interface SecurityEventItem {
  event_id: string;
  call_id: string;
  severity: string;
  title: string;
  description: string;
  action_taken: string;
  audit_hash: string;
  timestamp: string;
}

export interface AuditRecordItem {
  block_index: number;
  event_id: string;
  call_id: string;
  timestamp_str: string;
  risk_score: number;
  model_version: string;
  action: string;
  analysis_hash: string;
  previous_hash: string;
  block_hash: string;
}

export interface PrivacySettings {
  audio_retention_minutes: number;
  store_raw_audio: boolean;
  store_feature_data: boolean;
  anonymize_metadata: boolean;
  audit_logging_enabled: boolean;
}
