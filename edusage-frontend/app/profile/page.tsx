"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import API from "@/services/api";
import { 
  User, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  Edit3,
  Save,
  UserCircle,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Heart,
  Clock,
  Brain,
  BarChart,
  Globe,
  Linkedin,
  Github,
  Code,
  Briefcase,
  Award as Certificate,
  Users,
  Star,
  Zap,
  Sparkles,
  Trophy,
  Bot,
  Lightbulb
} from "lucide-react";

interface UserProfile {
  name?: string;
  email?: string;
  bio?: string;
  institution?: string;
  degree?: string;
  avatarUrl?: string;
  year?: string;
  semester?: string;
  phone?: string;
  location?: string;
  interests?: string;
  studyGoals?: string;
  preferredStudyTime?: string;
  learningStyle?: string;
  difficulty?: string;
  languages?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills?: string;
  experience?: string;
  projects?: string;
  certifications?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/me");
        setProfile(res.data || {});
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await API.put("/user/me", profile);
      setProfile(res.data || {});
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] via-white to-[#f0f7f7] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#4f8a8b]" />
          <span className="text-lg font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  const initials = (profile.name || profile.email || "U").slice(0, 2).toUpperCase();
  const completionScore = Object.values(profile).filter(Boolean).length;
  const totalFields = 21; // Updated total number of fields
  const completionPercentage = Math.round((completionScore / totalFields) * 100);

  return (
    <div className="w-full space-y-8 animate-slide-up">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60 backdrop-blur-sm mb-8">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse" />
            <span className="text-sm font-bold text-purple-700">User Profile</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">Profile</span>
          </h1>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Manage your personal and academic information to personalize your EduSage experience. 
            Keep your profile updated for better AI-powered learning recommendations.
          </p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-center mb-2">
              <TrendingUp size={32} className="text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-2">{completionPercentage}%</div>
            <div className="text-sm text-purple-600 font-medium">Profile Complete</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-center mb-2">
              <Bot size={32} className="text-blue-600" />
            </div>
            <div className="text-sm text-blue-600 font-medium">AI Personalized</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-center mb-2">
              <Zap size={32} className="text-emerald-600" />
            </div>
            <div className="text-sm text-emerald-600 font-medium">Smart Learning</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"></div>
            </div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-300/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-center mb-2">
              <Target size={32} className="text-amber-600" />
            </div>
            <div className="text-sm text-amber-600 font-medium">Goal Oriented</div>
            <div className="mt-3 flex justify-center">
              <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Profile Overview Section */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-xl">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4f8a8b]/3 via-transparent to-[#9cc7c7]/3 opacity-60" />
            
            {/* Content */}
            <div className="relative z-10 p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Left side - Profile Card */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#4f8a8b] to-[#3e6f70] flex items-center justify-center text-white shadow-lg">
                      <UserCircle size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed font-medium text-sm">
                    Update your personal and academic details to help EduSage provide personalized 
                    learning experiences tailored to your educational journey.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-300/60">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-bold text-emerald-700">Personalized AI</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/60">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-sm font-bold text-blue-700">Smart Recommendations</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-sm font-bold text-purple-700">Academic Focus</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side - Profile Preview */}
                <div className="flex-1 w-full max-w-sm">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200/60">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl font-bold text-purple-600">{initials}</span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {profile.name || "Your Name"}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {profile.email || "your.email@example.com"}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/60">
                        <span className="text-sm font-medium text-purple-700">
                          {completionPercentage}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg">
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
              
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <Edit3 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="text-green-700 text-sm">{success}</p>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User size={18} className="text-purple-600" />
                      Basic Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <Input
                          value={profile.name || ""}
                          onChange={e => handleChange("name", e.target.value)}
                          placeholder="Your full name"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <Input
                          type="email"
                          value={profile.email || ""}
                          onChange={e => handleChange("email", e.target.value)}
                          placeholder="you@example.com"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <Input
                          value={profile.phone || ""}
                          onChange={e => handleChange("phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                        <Input
                          value={profile.location || ""}
                          onChange={e => handleChange("location", e.target.value)}
                          placeholder="City, Country"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap size={18} className="text-purple-600" />
                      Academic Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Institution</label>
                        <Input
                          value={profile.institution || ""}
                          onChange={e => handleChange("institution", e.target.value)}
                          placeholder="College or university"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Degree / Focus</label>
                        <Input
                          value={profile.degree || ""}
                          onChange={e => handleChange("degree", e.target.value)}
                          placeholder="e.g. B.Tech CS, SEPM"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
                        <Input
                          value={profile.year || ""}
                          onChange={e => handleChange("year", e.target.value)}
                          placeholder="e.g. 2nd year, Final year"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Semester</label>
                        <Input
                          value={profile.semester || ""}
                          onChange={e => handleChange("semester", e.target.value)}
                          placeholder="e.g. Sem 3, Sem 6"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Learning Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Brain size={18} className="text-purple-600" />
                      Learning Preferences
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Interests</label>
                        <Input
                          value={profile.interests || ""}
                          onChange={e => handleChange("interests", e.target.value)}
                          placeholder="e.g. Machine Learning, Web Development"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Study Goals</label>
                        <Input
                          value={profile.studyGoals || ""}
                          onChange={e => handleChange("studyGoals", e.target.value)}
                          placeholder="e.g. Get better grades, Learn new skills"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Study Time</label>
                        <Input
                          value={profile.preferredStudyTime || ""}
                          onChange={e => handleChange("preferredStudyTime", e.target.value)}
                          placeholder="e.g. Morning, Evening, Night"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Learning Style</label>
                        <Input
                          value={profile.learningStyle || ""}
                          onChange={e => handleChange("learningStyle", e.target.value)}
                          placeholder="e.g. Visual, Auditory, Kinesthetic"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase size={18} className="text-purple-600" />
                      Professional Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Skills</label>
                        <Input
                          value={profile.skills || ""}
                          onChange={e => handleChange("skills", e.target.value)}
                          placeholder="e.g. JavaScript, Python, React"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Experience</label>
                        <Input
                          value={profile.experience || ""}
                          onChange={e => handleChange("experience", e.target.value)}
                          placeholder="e.g. 2 years, Internship"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Projects</label>
                        <Input
                          value={profile.projects || ""}
                          onChange={e => handleChange("projects", e.target.value)}
                          placeholder="e.g. E-commerce site, Mobile app"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Certifications</label>
                        <Input
                          value={profile.certifications || ""}
                          onChange={e => handleChange("certifications", e.target.value)}
                          placeholder="e.g. AWS Certified, Google Cloud"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Globe size={18} className="text-purple-600" />
                      Social Links
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                        <Input
                          value={profile.website || ""}
                          onChange={e => handleChange("website", e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn</label>
                        <Input
                          value={profile.linkedin || ""}
                          onChange={e => handleChange("linkedin", e.target.value)}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">GitHub</label>
                        <Input
                          value={profile.github || ""}
                          onChange={e => handleChange("github", e.target.value)}
                          placeholder="https://github.com/yourusername"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Languages</label>
                        <Input
                          value={profile.languages || ""}
                          onChange={e => handleChange("languages", e.target.value)}
                          placeholder="e.g. English, Spanish, French"
                          className="h-11 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Target size={18} className="text-purple-600" />
                      About You
                    </h3>
                    <Textarea
                      value={profile.bio || ""}
                      onChange={e => handleChange("bio", e.target.value)}
                      placeholder="Tell us about yourself, your academic interests, career goals, and how you use EduSage to enhance your learning experience."
                      rows={4}
                      className="rounded-xl border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="h-12 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {saving ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save size={18} />
                          Save Changes
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0 transform scale-x-0 transition-transform duration-300 hover:scale-x-100" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Preview Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <div className="relative z-10 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserCircle size={18} className="text-purple-600" />
                  Profile Preview
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">{initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {profile.name || "Your Name"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {profile.email || "your.email@example.com"}
                    </p>
                  </div>
                </div>
                
                {profile.institution && (
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <GraduationCap size={14} />
                      <span>{profile.institution}</span>
                    </div>
                    {profile.degree && <span className="ml-6">{profile.degree}</span>}
                  </div>
                )}
                
                {profile.phone && (
                  <div className="text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{profile.phone}</span>
                    </div>
                  </div>
                )}
                
                {profile.location && (
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Preferences Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg animate-scale-in" style={{ animationDelay: "0.5s" }}>
              <div className="relative z-10 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain size={18} className="text-purple-600" />
                  Learning Preferences
                </h3>
                
                <div className="space-y-3 text-sm">
                  {profile.interests && (
                    <div className="flex items-start gap-2">
                      <Heart size={14} className="text-gray-400 mt-0.5" />
                      <span className="text-gray-600">
                        <span className="font-medium">Interests:</span> {profile.interests}
                      </span>
                    </div>
                  )}
                  
                  {profile.studyGoals && (
                    <div className="flex items-start gap-2">
                      <Target size={14} className="text-gray-400 mt-0.5" />
                      <span className="text-gray-600">
                        <span className="font-medium">Goals:</span> {profile.studyGoals}
                      </span>
                    </div>
                  )}
                  
                  {profile.preferredStudyTime && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        <span className="font-medium">Study Time:</span> {profile.preferredStudyTime}
                      </span>
                    </div>
                  )}
                  
                  {profile.learningStyle && (
                    <div className="flex items-center gap-2">
                      <Brain size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        <span className="font-medium">Style:</span> {profile.learningStyle}
                      </span>
                    </div>
                  )}
                  
                  {!profile.interests && !profile.studyGoals && !profile.preferredStudyTime && !profile.learningStyle && (
                    <div className="text-gray-500 text-center py-2">
                      Add your learning preferences to personalize your experience
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#fafbfb] to-[#f8fafa] border border-gray-200/60 shadow-lg animate-scale-in" style={{ animationDelay: "0.6s" }}>
              <div className="relative z-10 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={18} className="text-purple-600" />
                  Profile Strength
                </h3>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    {completionPercentage}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Complete your profile for better AI recommendations
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Basic Info</span>
                      <span className="text-purple-600">{[profile.name, profile.email, profile.phone, profile.location].filter(Boolean).length}/4</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Academic</span>
                      <span className="text-purple-600">{[profile.institution, profile.degree, profile.year, profile.semester].filter(Boolean).length}/4</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Learning</span>
                      <span className="text-purple-600">{[profile.interests, profile.studyGoals, profile.preferredStudyTime, profile.learningStyle].filter(Boolean).length}/4</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Professional</span>
                      <span className="text-purple-600">{[profile.skills, profile.experience, profile.projects, profile.certifications].filter(Boolean).length}/4</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Social</span>
                      <span className="text-purple-600">{[profile.website, profile.linkedin, profile.github, profile.languages].filter(Boolean).length}/4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Tips Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-300/60 shadow-lg animate-scale-in" style={{ animationDelay: "0.7s" }}>
              <div className="relative z-10 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-purple-600" />
                  Pro Tips
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Star size={14} className="text-amber-500 mt-0.5" />
                    <span className="text-gray-700">
                      Complete your profile to unlock personalized AI recommendations
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles size={14} className="text-purple-500 mt-0.5" />
                    <span className="text-gray-700">
                      Add your learning preferences for better study suggestions
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Trophy size={14} className="text-amber-600 mt-0.5" />
                    <span className="text-gray-700">
                      Include your skills to get relevant content recommendations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
