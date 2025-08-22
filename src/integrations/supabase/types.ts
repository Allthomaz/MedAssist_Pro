export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.4';
  };
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string;
          appointment_reason: string | null;
          appointment_time: string;
          appointment_type: string;
          cancellation_reason: string | null;
          cancelled_at: string | null;
          cancelled_by: string | null;
          chief_complaint: string | null;
          confirmation_sent: boolean | null;
          confirmation_sent_at: string | null;
          confirmed_at: string | null;
          confirmed_by_patient: boolean | null;
          consultation_id: string | null;
          consultation_mode: string;
          created_at: string;
          doctor_id: string;
          duration: number;
          id: string;
          is_first_time: boolean | null;
          location: string | null;
          notes: string | null;
          patient_email: string | null;
          patient_id: string | null;
          patient_name: string | null;
          patient_phone: string | null;
          reminder_sent: boolean | null;
          reminder_sent_at: string | null;
          rescheduled_from: string | null;
          special_instructions: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          appointment_date: string;
          appointment_reason?: string | null;
          appointment_time: string;
          appointment_type: string;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          chief_complaint?: string | null;
          confirmation_sent?: boolean | null;
          confirmation_sent_at?: string | null;
          confirmed_at?: string | null;
          confirmed_by_patient?: boolean | null;
          consultation_id?: string | null;
          consultation_mode?: string;
          created_at?: string;
          doctor_id: string;
          duration?: number;
          id?: string;
          is_first_time?: boolean | null;
          location?: string | null;
          notes?: string | null;
          patient_email?: string | null;
          patient_id?: string | null;
          patient_name?: string | null;
          patient_phone?: string | null;
          reminder_sent?: boolean | null;
          reminder_sent_at?: string | null;
          rescheduled_from?: string | null;
          special_instructions?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          appointment_date?: string;
          appointment_reason?: string | null;
          appointment_time?: string;
          appointment_type?: string;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          chief_complaint?: string | null;
          confirmation_sent?: boolean | null;
          confirmation_sent_at?: string | null;
          confirmed_at?: string | null;
          confirmed_by_patient?: boolean | null;
          consultation_id?: string | null;
          consultation_mode?: string;
          created_at?: string;
          doctor_id?: string;
          duration?: number;
          id?: string;
          is_first_time?: boolean | null;
          location?: string | null;
          notes?: string | null;
          patient_email?: string | null;
          patient_id?: string | null;
          patient_name?: string | null;
          patient_phone?: string | null;
          reminder_sent?: boolean | null;
          reminder_sent_at?: string | null;
          rescheduled_from?: string | null;
          special_instructions?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'appointments_consultation_id_fkey';
            columns: ['consultation_id'];
            isOneToOne: false;
            referencedRelation: 'consultations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointments_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointments_rescheduled_from_fkey';
            columns: ['rescheduled_from'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
        ];
      };
      consultations: {
        Row: {
          actual_duration: number | null;
          chief_complaint: string | null;
          clinical_notes: string | null;
          consultation_date: string;
          consultation_mode: string;
          consultation_number: string | null;
          consultation_reason: string | null;
          consultation_time: string;
          consultation_type: string;
          created_at: string;
          diagnosis: string | null;
          doctor_id: string;
          document_generated: boolean | null;
          document_template_id: string | null;
          document_url: string | null;
          finished_at: string | null;
          follow_up_date: string | null;
          has_recording: boolean | null;
          has_transcription: boolean | null;
          id: string;
          location: string | null;
          patient_id: string;
          prescriptions: string | null;
          recommendations: string | null;
          recording_duration: number | null;
          recording_url: string | null;
          scheduled_duration: number | null;
          started_at: string | null;
          status: string;
          transcription_confidence: number | null;
          transcription_text: string | null;
          treatment_plan: string | null;
          updated_at: string;
          vital_signs: Json | null;
        };
        Insert: {
          actual_duration?: number | null;
          chief_complaint?: string | null;
          clinical_notes?: string | null;
          consultation_date: string;
          consultation_mode?: string;
          consultation_number?: string | null;
          consultation_reason?: string | null;
          consultation_time: string;
          consultation_type: string;
          created_at?: string;
          diagnosis?: string | null;
          doctor_id: string;
          document_generated?: boolean | null;
          document_template_id?: string | null;
          document_url?: string | null;
          finished_at?: string | null;
          follow_up_date?: string | null;
          has_recording?: boolean | null;
          has_transcription?: boolean | null;
          id?: string;
          location?: string | null;
          patient_id: string;
          prescriptions?: string | null;
          recommendations?: string | null;
          recording_duration?: number | null;
          recording_url?: string | null;
          scheduled_duration?: number | null;
          started_at?: string | null;
          status?: string;
          transcription_confidence?: number | null;
          transcription_text?: string | null;
          treatment_plan?: string | null;
          updated_at?: string;
          vital_signs?: Json | null;
        };
        Update: {
          actual_duration?: number | null;
          chief_complaint?: string | null;
          clinical_notes?: string | null;
          consultation_date?: string;
          consultation_mode?: string;
          consultation_number?: string | null;
          consultation_reason?: string | null;
          consultation_time?: string;
          consultation_type?: string;
          created_at?: string;
          diagnosis?: string | null;
          doctor_id?: string;
          document_generated?: boolean | null;
          document_template_id?: string | null;
          document_url?: string | null;
          finished_at?: string | null;
          follow_up_date?: string | null;
          has_recording?: boolean | null;
          has_transcription?: boolean | null;
          id?: string;
          location?: string | null;
          patient_id?: string;
          prescriptions?: string | null;
          recommendations?: string | null;
          recording_duration?: number | null;
          recording_url?: string | null;
          scheduled_duration?: number | null;
          started_at?: string | null;
          status?: string;
          transcription_confidence?: number | null;
          transcription_text?: string | null;
          treatment_plan?: string | null;
          updated_at?: string;
          vital_signs?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'consultations_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      doctor_schedules: {
        Row: {
          break_duration: number | null;
          created_at: string;
          day_of_week: number;
          default_duration: number | null;
          doctor_id: string;
          end_time: string;
          id: string;
          is_active: boolean | null;
          start_time: string;
          updated_at: string;
        };
        Insert: {
          break_duration?: number | null;
          created_at?: string;
          day_of_week: number;
          default_duration?: number | null;
          doctor_id: string;
          end_time: string;
          id?: string;
          is_active?: boolean | null;
          start_time: string;
          updated_at?: string;
        };
        Update: {
          break_duration?: number | null;
          created_at?: string;
          day_of_week?: number;
          default_duration?: number | null;
          doctor_id?: string;
          end_time?: string;
          id?: string;
          is_active?: boolean | null;
          start_time?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      document_attachments: {
        Row: {
          attachment_type: string;
          created_at: string;
          description: string | null;
          display_order: number | null;
          document_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          attachment_type: string;
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          document_id: string;
          file_name: string;
          file_size: number;
          file_type: string;
          file_url: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          attachment_type?: string;
          created_at?: string;
          description?: string | null;
          display_order?: number | null;
          document_id?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          file_url?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'document_attachments_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      document_history: {
        Row: {
          action: string;
          change_reason: string | null;
          changed_at: string;
          changed_by: string | null;
          changed_fields: string[] | null;
          document_id: string;
          id: string;
          new_data: Json | null;
          previous_data: Json | null;
        };
        Insert: {
          action: string;
          change_reason?: string | null;
          changed_at?: string;
          changed_by?: string | null;
          changed_fields?: string[] | null;
          document_id: string;
          id?: string;
          new_data?: Json | null;
          previous_data?: Json | null;
        };
        Update: {
          action?: string;
          change_reason?: string | null;
          changed_at?: string;
          changed_by?: string | null;
          changed_fields?: string[] | null;
          document_id?: string;
          id?: string;
          new_data?: Json | null;
          previous_data?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'document_history_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      document_shares: {
        Row: {
          access_count: number | null;
          access_password: string | null;
          access_token: string | null;
          created_at: string;
          document_id: string;
          download_count: number | null;
          expires_at: string | null;
          id: string;
          is_active: boolean | null;
          last_accessed_at: string | null;
          max_downloads: number | null;
          requires_password: boolean | null;
          share_type: string;
          shared_by: string;
          shared_with_email: string | null;
          shared_with_name: string | null;
          updated_at: string;
        };
        Insert: {
          access_count?: number | null;
          access_password?: string | null;
          access_token?: string | null;
          created_at?: string;
          document_id: string;
          download_count?: number | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_accessed_at?: string | null;
          max_downloads?: number | null;
          requires_password?: boolean | null;
          share_type: string;
          shared_by: string;
          shared_with_email?: string | null;
          shared_with_name?: string | null;
          updated_at?: string;
        };
        Update: {
          access_count?: number | null;
          access_password?: string | null;
          access_token?: string | null;
          created_at?: string;
          document_id?: string;
          download_count?: number | null;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_accessed_at?: string | null;
          max_downloads?: number | null;
          requires_password?: boolean | null;
          share_type?: string;
          shared_by?: string;
          shared_with_email?: string | null;
          shared_with_name?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'document_shares_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
        ];
      };
      document_templates: {
        Row: {
          category: string | null;
          created_at: string;
          custom_css: string | null;
          description: string | null;
          doctor_id: string;
          document_type: string;
          id: string;
          is_active: boolean | null;
          is_default: boolean | null;
          is_public: boolean | null;
          last_used_at: string | null;
          name: string;
          parent_template_id: string | null;
          print_settings: Json | null;
          tags: string[] | null;
          template_content: string | null;
          template_structure: Json;
          template_variables: Json | null;
          updated_at: string;
          usage_count: number | null;
          version: number | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          custom_css?: string | null;
          description?: string | null;
          doctor_id: string;
          document_type: string;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          is_public?: boolean | null;
          last_used_at?: string | null;
          name: string;
          parent_template_id?: string | null;
          print_settings?: Json | null;
          tags?: string[] | null;
          template_content?: string | null;
          template_structure?: Json;
          template_variables?: Json | null;
          updated_at?: string;
          usage_count?: number | null;
          version?: number | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          custom_css?: string | null;
          description?: string | null;
          doctor_id?: string;
          document_type?: string;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          is_public?: boolean | null;
          last_used_at?: string | null;
          name?: string;
          parent_template_id?: string | null;
          print_settings?: Json | null;
          tags?: string[] | null;
          template_content?: string | null;
          template_structure?: Json;
          template_variables?: Json | null;
          updated_at?: string;
          usage_count?: number | null;
          version?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'document_templates_parent_template_id_fkey';
            columns: ['parent_template_id'];
            isOneToOne: false;
            referencedRelation: 'document_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      documents: {
        Row: {
          category: string | null;
          consultation_id: string | null;
          content_data: Json;
          content_html: string | null;
          content_text: string | null;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          doctor_id: string;
          document_number: string | null;
          document_type: string;
          id: string;
          is_signed: boolean | null;
          metadata: Json | null;
          parent_document_id: string | null;
          patient_email_sent: string | null;
          patient_id: string | null;
          pdf_file_size: number | null;
          pdf_url: string | null;
          sent_to_patient: boolean | null;
          sent_to_patient_at: string | null;
          signature_data: Json | null;
          signed_at: string | null;
          status: string;
          tags: string[] | null;
          template_id: string | null;
          title: string;
          updated_at: string;
          valid_from: string | null;
          valid_until: string | null;
          version: number | null;
        };
        Insert: {
          category?: string | null;
          consultation_id?: string | null;
          content_data?: Json;
          content_html?: string | null;
          content_text?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          doctor_id: string;
          document_number?: string | null;
          document_type: string;
          id?: string;
          is_signed?: boolean | null;
          metadata?: Json | null;
          parent_document_id?: string | null;
          patient_email_sent?: string | null;
          patient_id?: string | null;
          pdf_file_size?: number | null;
          pdf_url?: string | null;
          sent_to_patient?: boolean | null;
          sent_to_patient_at?: string | null;
          signature_data?: Json | null;
          signed_at?: string | null;
          status?: string;
          tags?: string[] | null;
          template_id?: string | null;
          title: string;
          updated_at?: string;
          valid_from?: string | null;
          valid_until?: string | null;
          version?: number | null;
        };
        Update: {
          category?: string | null;
          consultation_id?: string | null;
          content_data?: Json;
          content_html?: string | null;
          content_text?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          doctor_id?: string;
          document_number?: string | null;
          document_type?: string;
          id?: string;
          is_signed?: boolean | null;
          metadata?: Json | null;
          parent_document_id?: string | null;
          patient_email_sent?: string | null;
          patient_id?: string | null;
          pdf_file_size?: number | null;
          pdf_url?: string | null;
          sent_to_patient?: boolean | null;
          sent_to_patient_at?: string | null;
          signature_data?: Json | null;
          signed_at?: string | null;
          status?: string;
          tags?: string[] | null;
          template_id?: string | null;
          title?: string;
          updated_at?: string;
          valid_from?: string | null;
          valid_until?: string | null;
          version?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_consultation_id_fkey';
            columns: ['consultation_id'];
            isOneToOne: false;
            referencedRelation: 'consultations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_parent_document_id_fkey';
            columns: ['parent_document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'document_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_delivery_log: {
        Row: {
          attempted_at: string;
          channel: string;
          created_at: string;
          delivered_at: string | null;
          error_message: string | null;
          external_id: string | null;
          id: string;
          notification_id: string;
          provider: string | null;
          response_data: Json | null;
          status: string;
        };
        Insert: {
          attempted_at?: string;
          channel: string;
          created_at?: string;
          delivered_at?: string | null;
          error_message?: string | null;
          external_id?: string | null;
          id?: string;
          notification_id: string;
          provider?: string | null;
          response_data?: Json | null;
          status: string;
        };
        Update: {
          attempted_at?: string;
          channel?: string;
          created_at?: string;
          delivered_at?: string | null;
          error_message?: string | null;
          external_id?: string | null;
          id?: string;
          notification_id?: string;
          provider?: string | null;
          response_data?: Json | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_delivery_log_notification_id_fkey';
            columns: ['notification_id'];
            isOneToOne: false;
            referencedRelation: 'notifications';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_preferences: {
        Row: {
          allowed_days: number[] | null;
          created_at: string;
          email_enabled: boolean | null;
          id: string;
          in_app_enabled: boolean | null;
          notification_type: string;
          push_enabled: boolean | null;
          quiet_hours_end: string | null;
          quiet_hours_start: string | null;
          sms_enabled: boolean | null;
          updated_at: string;
          user_id: string;
          whatsapp_enabled: boolean | null;
        };
        Insert: {
          allowed_days?: number[] | null;
          created_at?: string;
          email_enabled?: boolean | null;
          id?: string;
          in_app_enabled?: boolean | null;
          notification_type: string;
          push_enabled?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          sms_enabled?: boolean | null;
          updated_at?: string;
          user_id: string;
          whatsapp_enabled?: boolean | null;
        };
        Update: {
          allowed_days?: number[] | null;
          created_at?: string;
          email_enabled?: boolean | null;
          id?: string;
          in_app_enabled?: boolean | null;
          notification_type?: string;
          push_enabled?: boolean | null;
          quiet_hours_end?: string | null;
          quiet_hours_start?: string | null;
          sms_enabled?: boolean | null;
          updated_at?: string;
          user_id?: string;
          whatsapp_enabled?: boolean | null;
        };
        Relationships: [];
      };
      notification_templates: {
        Row: {
          available_variables: Json | null;
          created_at: string;
          description: string | null;
          email_body: string | null;
          email_subject: string | null;
          id: string;
          in_app_message: string | null;
          in_app_title: string | null;
          is_active: boolean | null;
          name: string;
          notification_type: string;
          push_message: string | null;
          push_title: string | null;
          sms_message: string | null;
          template_key: string;
          updated_at: string;
          whatsapp_message: string | null;
        };
        Insert: {
          available_variables?: Json | null;
          created_at?: string;
          description?: string | null;
          email_body?: string | null;
          email_subject?: string | null;
          id?: string;
          in_app_message?: string | null;
          in_app_title?: string | null;
          is_active?: boolean | null;
          name: string;
          notification_type: string;
          push_message?: string | null;
          push_title?: string | null;
          sms_message?: string | null;
          template_key: string;
          updated_at?: string;
          whatsapp_message?: string | null;
        };
        Update: {
          available_variables?: Json | null;
          created_at?: string;
          description?: string | null;
          email_body?: string | null;
          email_subject?: string | null;
          id?: string;
          in_app_message?: string | null;
          in_app_title?: string | null;
          is_active?: boolean | null;
          name?: string;
          notification_type?: string;
          push_message?: string | null;
          push_title?: string | null;
          sms_message?: string | null;
          template_key?: string;
          updated_at?: string;
          whatsapp_message?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          appointment_id: string | null;
          channel: string;
          consultation_id: string | null;
          created_at: string;
          data: Json | null;
          delivered_at: string | null;
          delivery_status: string | null;
          document_id: string | null;
          id: string;
          message: string;
          patient_id: string | null;
          priority: string;
          read_at: string | null;
          scheduled_for: string | null;
          sent_at: string | null;
          status: string;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          appointment_id?: string | null;
          channel?: string;
          consultation_id?: string | null;
          created_at?: string;
          data?: Json | null;
          delivered_at?: string | null;
          delivery_status?: string | null;
          document_id?: string | null;
          id?: string;
          message: string;
          patient_id?: string | null;
          priority?: string;
          read_at?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: string;
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          appointment_id?: string | null;
          channel?: string;
          consultation_id?: string | null;
          created_at?: string;
          data?: Json | null;
          delivered_at?: string | null;
          delivery_status?: string | null;
          document_id?: string | null;
          id?: string;
          message?: string;
          patient_id?: string | null;
          priority?: string;
          read_at?: string | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: string;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_consultation_id_fkey';
            columns: ['consultation_id'];
            isOneToOne: false;
            referencedRelation: 'consultations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      oauth_connections: {
        Row: {
          access_token: string;
          created_at: string;
          expiry_date: string | null;
          id: string;
          provider: string;
          refresh_token: string | null;
          scope: string | null;
          token_type: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          access_token: string;
          created_at?: string;
          expiry_date?: string | null;
          id?: string;
          provider: string;
          refresh_token?: string | null;
          scope?: string | null;
          token_type?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          access_token?: string;
          created_at?: string;
          expiry_date?: string | null;
          id?: string;
          provider?: string;
          refresh_token?: string | null;
          scope?: string | null;
          token_type?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      oauth_states: {
        Row: {
          created_at: string;
          redirect_to: string | null;
          state: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          redirect_to?: string | null;
          state: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          redirect_to?: string | null;
          state?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      patients: {
        Row: {
          address: string | null;
          address_complement: string | null;
          address_number: string | null;
          allergies: string[] | null;
          birth_date: string;
          blood_type: string | null;
          chronic_conditions: string[] | null;
          city: string | null;
          country: string | null;
          cpf: string | null;
          created_at: string;
          current_medications: string[] | null;
          doctor_id: string;
          email: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          emergency_contact_phone2: string | null;
          emergency_contact_relationship: string | null;
          family_history: string | null;
          full_name: string;
          gender: string;
          height: number | null;
          id: string;
          insurance_company: string | null;
          insurance_number: string | null;
          insurance_plan: string | null;
          marital_status: string | null;
          mobile_phone: string | null;
          neighborhood: string | null;
          notes: string | null;
          occupation: string | null;
          patient_number: string | null;
          phone: string | null;
          profile_id: string | null;
          rg: string | null;
          state: string | null;
          status: string;
          updated_at: string;
          weight: number | null;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          address_complement?: string | null;
          address_number?: string | null;
          allergies?: string[] | null;
          birth_date: string;
          blood_type?: string | null;
          chronic_conditions?: string[] | null;
          city?: string | null;
          country?: string | null;
          cpf?: string | null;
          created_at?: string;
          current_medications?: string[] | null;
          doctor_id: string;
          email?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_phone2?: string | null;
          emergency_contact_relationship?: string | null;
          family_history?: string | null;
          full_name: string;
          gender: string;
          height?: number | null;
          id?: string;
          insurance_company?: string | null;
          insurance_number?: string | null;
          insurance_plan?: string | null;
          marital_status?: string | null;
          mobile_phone?: string | null;
          neighborhood?: string | null;
          notes?: string | null;
          occupation?: string | null;
          patient_number?: string | null;
          phone?: string | null;
          profile_id?: string | null;
          rg?: string | null;
          state?: string | null;
          status?: string;
          updated_at?: string;
          weight?: number | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          address_complement?: string | null;
          address_number?: string | null;
          allergies?: string[] | null;
          birth_date?: string;
          blood_type?: string | null;
          chronic_conditions?: string[] | null;
          city?: string | null;
          country?: string | null;
          cpf?: string | null;
          created_at?: string;
          current_medications?: string[] | null;
          doctor_id?: string;
          email?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_phone2?: string | null;
          emergency_contact_relationship?: string | null;
          family_history?: string | null;
          full_name?: string;
          gender?: string;
          height?: number | null;
          id?: string;
          insurance_company?: string | null;
          insurance_number?: string | null;
          insurance_plan?: string | null;
          marital_status?: string | null;
          mobile_phone?: string | null;
          neighborhood?: string | null;
          notes?: string | null;
          occupation?: string | null;
          patient_number?: string | null;
          phone?: string | null;
          profile_id?: string | null;
          rg?: string | null;
          state?: string | null;
          status?: string;
          updated_at?: string;
          weight?: number | null;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'patients_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          crm: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: string;
          specialty: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          crm?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role: string;
          specialty?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          crm?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: string;
          specialty?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      recordings: {
        Row: {
          audio_duration: number | null;
          audio_file_name: string;
          audio_file_size: number | null;
          audio_format: string | null;
          audio_quality: string | null;
          audio_url: string;
          auto_transcribe: boolean | null;
          bit_rate: number | null;
          channels: number | null;
          consultation_id: string;
          created_at: string;
          description: string | null;
          doctor_id: string;
          ended_at: string | null;
          id: string;
          language_code: string | null;
          patient_id: string | null;
          processing_completed_at: string | null;
          processing_error: string | null;
          processing_started_at: string | null;
          recording_name: string;
          recording_status: string;
          sample_rate: number | null;
          started_at: string | null;
          updated_at: string;
        };
        Insert: {
          audio_duration?: number | null;
          audio_file_name: string;
          audio_file_size?: number | null;
          audio_format?: string | null;
          audio_quality?: string | null;
          audio_url: string;
          auto_transcribe?: boolean | null;
          bit_rate?: number | null;
          channels?: number | null;
          consultation_id: string;
          created_at?: string;
          description?: string | null;
          doctor_id: string;
          ended_at?: string | null;
          id?: string;
          language_code?: string | null;
          patient_id?: string | null;
          processing_completed_at?: string | null;
          processing_error?: string | null;
          processing_started_at?: string | null;
          recording_name: string;
          recording_status?: string;
          sample_rate?: number | null;
          started_at?: string | null;
          updated_at?: string;
        };
        Update: {
          audio_duration?: number | null;
          audio_file_name?: string;
          audio_file_size?: number | null;
          audio_format?: string | null;
          audio_quality?: string | null;
          audio_url?: string;
          auto_transcribe?: boolean | null;
          bit_rate?: number | null;
          channels?: number | null;
          consultation_id?: string;
          created_at?: string;
          description?: string | null;
          doctor_id?: string;
          ended_at?: string | null;
          id?: string;
          language_code?: string | null;
          patient_id?: string | null;
          processing_completed_at?: string | null;
          processing_error?: string | null;
          processing_started_at?: string | null;
          recording_name?: string;
          recording_status?: string;
          sample_rate?: number | null;
          started_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recordings_consultation_id_fkey';
            columns: ['consultation_id'];
            isOneToOne: false;
            referencedRelation: 'consultations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'recordings_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      schedule_blocks: {
        Row: {
          block_type: string;
          created_at: string;
          description: string | null;
          doctor_id: string;
          end_date: string;
          end_time: string | null;
          id: string;
          is_recurring: boolean | null;
          start_date: string;
          start_time: string | null;
          updated_at: string;
        };
        Insert: {
          block_type: string;
          created_at?: string;
          description?: string | null;
          doctor_id: string;
          end_date: string;
          end_time?: string | null;
          id?: string;
          is_recurring?: boolean | null;
          start_date: string;
          start_time?: string | null;
          updated_at?: string;
        };
        Update: {
          block_type?: string;
          created_at?: string;
          description?: string | null;
          doctor_id?: string;
          end_date?: string;
          end_time?: string | null;
          id?: string;
          is_recurring?: boolean | null;
          start_date?: string;
          start_time?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      security_audit_log: {
        Row: {
          error_message: string | null;
          id: string;
          ip_address: unknown | null;
          operation: string;
          sensitive_fields_accessed: string[] | null;
          success: boolean | null;
          table_name: string;
          timestamp: string;
          user_agent: string | null;
          user_id: string | null;
          user_role: string | null;
        };
        Insert: {
          error_message?: string | null;
          id?: string;
          ip_address?: unknown | null;
          operation: string;
          sensitive_fields_accessed?: string[] | null;
          success?: boolean | null;
          table_name: string;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
          user_role?: string | null;
        };
        Update: {
          error_message?: string | null;
          id?: string;
          ip_address?: unknown | null;
          operation?: string;
          sensitive_fields_accessed?: string[] | null;
          success?: boolean | null;
          table_name?: string;
          timestamp?: string;
          user_agent?: string | null;
          user_id?: string | null;
          user_role?: string | null;
        };
        Relationships: [];
      };
      shared_templates: {
        Row: {
          can_copy: boolean | null;
          can_modify: boolean | null;
          can_view: boolean | null;
          created_at: string;
          id: string;
          shared_by: string;
          shared_with: string | null;
          template_id: string;
          updated_at: string;
        };
        Insert: {
          can_copy?: boolean | null;
          can_modify?: boolean | null;
          can_view?: boolean | null;
          created_at?: string;
          id?: string;
          shared_by: string;
          shared_with?: string | null;
          template_id: string;
          updated_at?: string;
        };
        Update: {
          can_copy?: boolean | null;
          can_modify?: boolean | null;
          can_view?: boolean | null;
          created_at?: string;
          id?: string;
          shared_by?: string;
          shared_with?: string | null;
          template_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shared_templates_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'document_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      template_fields: {
        Row: {
          created_at: string;
          default_value: string | null;
          display_conditions: Json | null;
          display_order: number;
          field_config: Json | null;
          field_description: string | null;
          field_label: string;
          field_name: string;
          field_type: string;
          id: string;
          is_required: boolean | null;
          placeholder: string | null;
          section_id: string;
          updated_at: string;
          validation_rules: Json | null;
        };
        Insert: {
          created_at?: string;
          default_value?: string | null;
          display_conditions?: Json | null;
          display_order?: number;
          field_config?: Json | null;
          field_description?: string | null;
          field_label: string;
          field_name: string;
          field_type: string;
          id?: string;
          is_required?: boolean | null;
          placeholder?: string | null;
          section_id: string;
          updated_at?: string;
          validation_rules?: Json | null;
        };
        Update: {
          created_at?: string;
          default_value?: string | null;
          display_conditions?: Json | null;
          display_order?: number;
          field_config?: Json | null;
          field_description?: string | null;
          field_label?: string;
          field_name?: string;
          field_type?: string;
          id?: string;
          is_required?: boolean | null;
          placeholder?: string | null;
          section_id?: string;
          updated_at?: string;
          validation_rules?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'template_fields_section_id_fkey';
            columns: ['section_id'];
            isOneToOne: false;
            referencedRelation: 'template_sections';
            referencedColumns: ['id'];
          },
        ];
      };
      template_sections: {
        Row: {
          created_at: string;
          display_conditions: Json | null;
          display_order: number;
          id: string;
          is_collapsible: boolean | null;
          is_repeatable: boolean | null;
          is_required: boolean | null;
          section_description: string | null;
          section_name: string;
          section_title: string;
          template_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_conditions?: Json | null;
          display_order?: number;
          id?: string;
          is_collapsible?: boolean | null;
          is_repeatable?: boolean | null;
          is_required?: boolean | null;
          section_description?: string | null;
          section_name: string;
          section_title: string;
          template_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_conditions?: Json | null;
          display_order?: number;
          id?: string;
          is_collapsible?: boolean | null;
          is_repeatable?: boolean | null;
          is_required?: boolean | null;
          section_description?: string | null;
          section_name?: string;
          section_title?: string;
          template_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'template_sections_template_id_fkey';
            columns: ['template_id'];
            isOneToOne: false;
            referencedRelation: 'document_templates';
            referencedColumns: ['id'];
          },
        ];
      };
      transcription_annotations: {
        Row: {
          annotation_type: string;
          color: string | null;
          content: string;
          created_at: string;
          created_by: string;
          end_time: number | null;
          id: string;
          segment_id: string | null;
          start_time: number | null;
          title: string | null;
          transcription_id: string;
          updated_at: string;
        };
        Insert: {
          annotation_type: string;
          color?: string | null;
          content: string;
          created_at?: string;
          created_by: string;
          end_time?: number | null;
          id?: string;
          segment_id?: string | null;
          start_time?: number | null;
          title?: string | null;
          transcription_id: string;
          updated_at?: string;
        };
        Update: {
          annotation_type?: string;
          color?: string | null;
          content?: string;
          created_at?: string;
          created_by?: string;
          end_time?: number | null;
          id?: string;
          segment_id?: string | null;
          start_time?: number | null;
          title?: string | null;
          transcription_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transcription_annotations_segment_id_fkey';
            columns: ['segment_id'];
            isOneToOne: false;
            referencedRelation: 'transcription_segments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transcription_annotations_transcription_id_fkey';
            columns: ['transcription_id'];
            isOneToOne: false;
            referencedRelation: 'transcriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      transcription_segments: {
        Row: {
          confidence: number | null;
          created_at: string;
          end_time: number;
          id: string;
          segment_order: number;
          speaker_id: string | null;
          speaker_name: string | null;
          start_time: number;
          text: string;
          transcription_id: string;
          updated_at: string;
          words: Json | null;
        };
        Insert: {
          confidence?: number | null;
          created_at?: string;
          end_time: number;
          id?: string;
          segment_order: number;
          speaker_id?: string | null;
          speaker_name?: string | null;
          start_time: number;
          text: string;
          transcription_id: string;
          updated_at?: string;
          words?: Json | null;
        };
        Update: {
          confidence?: number | null;
          created_at?: string;
          end_time?: number;
          id?: string;
          segment_order?: number;
          speaker_id?: string | null;
          speaker_name?: string | null;
          start_time?: number;
          text?: string;
          transcription_id?: string;
          updated_at?: string;
          words?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'transcription_segments_transcription_id_fkey';
            columns: ['transcription_id'];
            isOneToOne: false;
            referencedRelation: 'transcriptions';
            referencedColumns: ['id'];
          },
        ];
      };
      transcription_settings: {
        Row: {
          auto_punctuation: boolean | null;
          auto_transcribe: boolean | null;
          created_at: string;
          custom_vocabulary: Json | null;
          default_language: string | null;
          delete_audio_after_days: number | null;
          doctor_id: string;
          encrypt_audio: boolean | null;
          id: string;
          notify_on_completion: boolean | null;
          notify_on_error: boolean | null;
          preferred_service: string | null;
          quality_level: string | null;
          speaker_diarization: boolean | null;
          store_audio_locally: boolean | null;
          updated_at: string;
        };
        Insert: {
          auto_punctuation?: boolean | null;
          auto_transcribe?: boolean | null;
          created_at?: string;
          custom_vocabulary?: Json | null;
          default_language?: string | null;
          delete_audio_after_days?: number | null;
          doctor_id: string;
          encrypt_audio?: boolean | null;
          id?: string;
          notify_on_completion?: boolean | null;
          notify_on_error?: boolean | null;
          preferred_service?: string | null;
          quality_level?: string | null;
          speaker_diarization?: boolean | null;
          store_audio_locally?: boolean | null;
          updated_at?: string;
        };
        Update: {
          auto_punctuation?: boolean | null;
          auto_transcribe?: boolean | null;
          created_at?: string;
          custom_vocabulary?: Json | null;
          default_language?: string | null;
          delete_audio_after_days?: number | null;
          doctor_id?: string;
          encrypt_audio?: boolean | null;
          id?: string;
          notify_on_completion?: boolean | null;
          notify_on_error?: boolean | null;
          preferred_service?: string | null;
          quality_level?: string | null;
          speaker_diarization?: boolean | null;
          store_audio_locally?: boolean | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      transcriptions: {
        Row: {
          confidence_score: number | null;
          consultation_id: string;
          created_at: string;
          error_message: string | null;
          id: string;
          language_detected: string | null;
          recording_id: string;
          review_notes: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          service_job_id: string | null;
          transcript_html: string | null;
          transcript_text: string;
          transcription_completed_at: string | null;
          transcription_service: string | null;
          transcription_started_at: string | null;
          transcription_status: string;
          updated_at: string;
          word_count: number | null;
        };
        Insert: {
          confidence_score?: number | null;
          consultation_id: string;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          language_detected?: string | null;
          recording_id: string;
          review_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          service_job_id?: string | null;
          transcript_html?: string | null;
          transcript_text: string;
          transcription_completed_at?: string | null;
          transcription_service?: string | null;
          transcription_started_at?: string | null;
          transcription_status?: string;
          updated_at?: string;
          word_count?: number | null;
        };
        Update: {
          confidence_score?: number | null;
          consultation_id?: string;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          language_detected?: string | null;
          recording_id?: string;
          review_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          service_job_id?: string | null;
          transcript_html?: string | null;
          transcript_text?: string;
          transcription_completed_at?: string | null;
          transcription_service?: string | null;
          transcription_started_at?: string | null;
          transcription_status?: string;
          updated_at?: string;
          word_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'transcriptions_consultation_id_fkey';
            columns: ['consultation_id'];
            isOneToOne: false;
            referencedRelation: 'consultations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transcriptions_recording_id_fkey';
            columns: ['recording_id'];
            isOneToOne: false;
            referencedRelation: 'recordings';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_recording_duration: {
        Args: { p_recording_id: string };
        Returns: number;
      };
      can_access_notification_templates: {
        Args: { user_id: string };
        Returns: boolean;
      };
      check_appointment_availability: {
        Args: {
          p_date: string;
          p_doctor_id: string;
          p_duration?: number;
          p_time: string;
        };
        Returns: boolean;
      };
      cleanup_old_notifications: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      cleanup_old_recordings: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      create_notification: {
        Args: {
          p_appointment_id?: string;
          p_channel?: string;
          p_consultation_id?: string;
          p_data?: Json;
          p_document_id?: string;
          p_message: string;
          p_patient_id?: string;
          p_priority?: string;
          p_scheduled_for?: string;
          p_title: string;
          p_type: string;
          p_user_id: string;
        };
        Returns: string;
      };
      duplicate_template: {
        Args: {
          p_doctor_id: string;
          p_new_name: string;
          p_template_id: string;
        };
        Returns: string;
      };
      generate_consultation_number: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      generate_document_number: {
        Args: { p_doctor_id: string; p_document_type: string };
        Returns: string;
      };
      generate_patient_number: {
        Args: { doctor_uuid: string };
        Returns: string;
      };
      increment_template_usage: {
        Args: { p_template_id: string };
        Returns: undefined;
      };
      is_active_doctor: {
        Args: { user_id: string };
        Returns: boolean;
      };
      is_active_patient: {
        Args: { user_id: string };
        Returns: boolean;
      };
      mark_notification_as_read: {
        Args: { notification_uuid: string };
        Returns: boolean;
      };
      validate_password_strength: {
        Args: { password: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
