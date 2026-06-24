import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  firstName: string;
  lastName: string;
  bio: string;
  interests: string[];
  primaryGoal: string;
  timezone: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profile: UserProfile = {
    firstName: '',
    lastName: '',
    bio: '',
    interests: [],
    primaryGoal: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    avatarUrl: ''
  };

  selectedFile: File | null = null;
  uploading = false;

  availableInterests = [
    'Fitness & Health',
    'Finance & Budgeting',
    'Productivity',
    'Learning & Education',
    'Coding & Tech',
    'Reading & Writing',
    'Travel',
    'Cooking',
    'Music',
    'Art & Design',
    'Gaming',
    'Sports'
  ];

  goalOptions = [
    'Weight Loss',
    'Save Money',
    'Learn New Skill',
    'Build Habit',
    'Complete Project',
    'Career Growth',
    'Health Improvement',
    'Other'
  ];

  editMode = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;

    if (this.user) {
      // Load from user metadata
      const metadata = this.user.user_metadata;
      this.profile.firstName = metadata?.['first_name'] || '';
      this.profile.lastName = metadata?.['last_name'] || '';
      this.profile.bio = metadata?.['bio'] || '';
      this.profile.interests = metadata?.['interests'] || [];
      this.profile.primaryGoal = metadata?.['primary_goal'] || '';
      this.profile.timezone = metadata?.['timezone'] || this.profile.timezone;
      this.profile.avatarUrl = metadata?.['avatar_url'] || '';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profile.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleInterest(interest: string) {
    const index = this.profile.interests.indexOf(interest);
    if (index > -1) {
      this.profile.interests.splice(index, 1);
    } else {
      this.profile.interests.push(interest);
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.profile.interests.includes(interest);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  async saveProfile() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      let avatarUrl = this.profile.avatarUrl;

      // Upload avatar if a new file was selected
      if (this.selectedFile) {
        this.uploading = true;
        const fileExt = this.selectedFile.name.split('.').pop();
        const fileName = `${this.user?.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await this.authService['supabase']
          .storage
          .from('avatars')
          .upload(filePath, this.selectedFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = this.authService['supabase']
          .storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
        this.uploading = false;
      }

      // Update user metadata in Supabase
      const { error } = await this.authService['supabase'].auth.updateUser({
        data: {
          first_name: this.profile.firstName,
          last_name: this.profile.lastName,
          bio: this.profile.bio,
          interests: this.profile.interests,
          primary_goal: this.profile.primaryGoal,
          timezone: this.profile.timezone,
          avatar_url: avatarUrl
        }
      });

      if (error) throw error;
      this.selectedFile = null;

      this.successMessage = 'Profile updated successfully!';
      this.editMode = false;

      // Refresh user data
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to update profile';
      console.error('Profile update error:', error);
    } finally {
      this.loading = false;
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.ngOnInit(); // Reload original data
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getJoinedDate(): string {
    if (!this.user?.created_at) return 'N/A';
    return new Date(this.user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
