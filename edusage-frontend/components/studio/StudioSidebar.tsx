"use client";

import { useState } from "react";
import { 
  Mic, 
  Video, 
  Network, 
  FileText, 
  Layers, 
  HelpCircle, 
  Image, 
  Presentation, 
  Table,
  Play,
  Pause,
  Download,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import API from "@/services/api";

interface StudioFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "idle" | "generating" | "completed" | "error";
  progress?: number;
  result?: string;
  sources?: number;
  error?: string | null;
  downloadUrl?: string;
}

interface StudioSidebarProps {
  notebookId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudioSidebar({ notebookId, isOpen, onClose }: StudioSidebarProps) {
  const [features, setFeatures] = useState<StudioFeature[]>([
    {
      id: "audio",
      title: "Audio Overview",
      description: "Create an audio summary of your documents",
      icon: <Mic className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "video",
      title: "Video Overview",
      description: "Generate a video script with scenes",
      icon: <Video className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "mindmap",
      title: "Mind Map",
      description: "Create a visual mind map of concepts",
      icon: <Network className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "report",
      title: "Reports",
      description: "Generate detailed structured reports",
      icon: <FileText className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Create Q&A flashcards for study",
      icon: <HelpCircle className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "quiz",
      title: "Quiz",
      description: "Generate quiz questions with answers",
      icon: <Layers className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "infographic",
      title: "Infographic",
      description: "Generate exam-prep notes PDF from all documents",
      icon: <Image className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "slides",
      title: "Slide Deck",
      description: "Generate presentation slides",
      icon: <Presentation className="w-5 h-5" />,
      status: "idle"
    },
    {
      id: "table",
      title: "Data Table",
      description: "Extract and organize data in tables",
      icon: <Table className="w-5 h-5" />,
      status: "idle"
    }
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "bn", name: "বাংলা" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "ml", name: "മലയാളം" },
    { code: "mr", name: "मराठी" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" }
  ];

  const handleFeatureClick = async (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature || feature.status === "generating") return;

    // Update feature status to generating
    setFeatures(prev => prev.map(f => 
      f.id === featureId 
        ? { ...f, status: "generating", progress: 0 }
        : f
    ));

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFeatures(prev => prev.map(f => {
          if (f.id === featureId && f.status === "generating") {
            const newProgress = Math.min((f.progress || 0) + 10, 90);
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 500);

      console.log(`[STUDIO] Requesting ${featureId} generation for notebook ${notebookId}`);
      
      // Make actual API call to studio endpoint
      const response = await API.post("/studio/generate", {
        type: featureId,
        notebookId: notebookId,
        query: "" // Optional: can add specific query if needed
      });

      console.log(`[STUDIO] Received response:`, response.data);
      clearInterval(progressInterval);

      // Update feature status to completed with result
      setFeatures(prev => prev.map(f => 
        f.id === featureId 
          ? { 
              ...f, 
              status: response.data.success ? "completed" : "error", 
              progress: 100,
              result: response.data.content,
              sources: response.data.sources,
              error: response.data.error || null,
              downloadUrl: response.data.downloadUrl || null
            }
          : f
      ));

      if (response.data.success) {
        console.log(`[STUDIO] Successfully generated ${featureId} content`);
      } else {
        console.error(`[STUDIO] Generation failed:`, response.data);
      }

    } catch (error: any) {
      console.error(`[STUDIO] Error generating ${featureId}:`, error);
      
      clearInterval(progressInterval);

      // Update to error with detailed error message
      setFeatures(prev => prev.map(f => 
        f.id === featureId 
          ? { 
              ...f, 
              status: "error",
              error: error.response?.data?.message || error.message || "Unknown error occurred"
            }
          : f
      ));
    }
  };

  const handleViewResult = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    // For infographic with downloadUrl, open the PDF in a new tab
    if (featureId === 'infographic' && feature.downloadUrl) {
      console.log(`[STUDIO] Opening infographic PDF: ${feature.downloadUrl}`);
      window.open(feature.downloadUrl, '_blank');
      return;
    }

    if (!feature.result) return;

    // For other features, download as text file
    const resultContent = feature.result;
    const blob = new Blob([resultContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${featureId}-content.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) return;

    // For infographic with downloadUrl, download the PDF
    if (featureId === 'infographic' && feature.downloadUrl) {
      console.log(`[STUDIO] Downloading infographic PDF: ${feature.downloadUrl}`);
      const a = document.createElement('a');
      a.href = feature.downloadUrl;
      a.download = 'exam_preparation_notes.pdf';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (!feature.result) return;

    // For other features, download as text file
    const resultContent = feature.result;
    const blob = new Blob([resultContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${featureId}-content.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: StudioFeature["status"]) => {
    switch (status) {
      case "generating":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Loader2 className="w-3 h-3 animate-spin mr-1" />Generating</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ready</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Studio</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* Language Selection for Audio Overview */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Audio Language</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLanguageOptions(!showLanguageOptions)}
              className="w-full justify-between"
            >
              {languages.find(l => l.code === selectedLanguage)?.name}
              <span className="text-xs text-gray-500">▼</span>
            </Button>
            {showLanguageOptions && (
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {languages.map(lang => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.code ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setShowLanguageOptions(false);
                    }}
                    className="w-full justify-start text-sm"
                  >
                    {lang.name}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="space-y-4">
          {features.map((feature) => (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-[#4f8a8b]">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(feature.status)}
                </div>
                
                {feature.status === "generating" && feature.progress && (
                  <div className="mt-3">
                    <Progress value={feature.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{feature.progress}% complete</p>
                  </div>
                )}

                <div className="mt-3 flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => feature.status === "completed" ? handleViewResult(feature.id) : handleFeatureClick(feature.id)}
                    disabled={feature.status === "generating"}
                    className="flex-1"
                  >
                    {feature.status === "generating" ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        Processing...
                      </>
                    ) : feature.status === "completed" ? (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        View
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Generate
                      </>
                    )}
                  </Button>
                  
                  {feature.status === "completed" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(feature.id)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {feature.status === "error" && (
                  <div className="mt-2">
                    <p className="text-xs text-red-500">
                      Failed to generate. Please try again.
                    </p>
                    {feature.error && (
                      <p className="text-xs text-gray-500 mt-1">
                        Error: {feature.error}
                      </p>
                    )}
                  </div>
                )}

                {feature.status === "completed" && feature.sources && (
                  <p className="text-xs text-gray-500 mt-2">
                    Generated from {feature.sources} source chunks
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note Section */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Add note</h4>
                <p className="text-xs text-gray-500">Add notes to your generated content</p>
              </div>
              <Button size="sm" variant="outline">
                Add note
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
