"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface SettingsPanelProps {
  onCaptionsChange: (enabled: boolean, language: string) => void
  isOwner?: boolean
  roomId?: string
  roomType?: string
  onEndForAll?: (enabled: boolean) => void
}

export function SettingsPanel({ onCaptionsChange, isOwner, roomId, roomType, onEndForAll }: SettingsPanelProps) {
  const [captionsEnabled, setCaptionsEnabled] = useState(false)
  const [captionLanguage, setCaptionLanguage] = useState("en-US")
  const [translateEnabled, setTranslateEnabled] = useState(false)
  const [translateLanguage, setTranslateLanguage] = useState("en")
  const [endCallForAll, setEndCallForAll] = useState(false)
  const { toast } = useToast()

  const handleRoomTypeChange = async (type: string) => {
    try {
      await fetch("/api/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, type }),
      })
      toast({ title: "Room Type Updated", description: `Call type changed to ${type}` })
    } catch (error) {
      console.error("Error updating room type:", error)
    }
  }

  useEffect(() => {
    if (isOwner && roomId) {
      const saved = localStorage.getItem(`room_${roomId}_endForAll`)
      if (saved) {
        setEndCallForAll(saved === "true")
      }
    }
  }, [isOwner, roomId])

  const handleEndForAllChange = (enabled: boolean) => {
    setEndCallForAll(enabled)
    if (roomId) {
      localStorage.setItem(`room_${roomId}_endForAll`, enabled.toString())
    }
    onEndForAll?.(enabled)
    toast({
      title: enabled ? "End Meeting for All Enabled" : "End Meeting for All Disabled",
      description: enabled
        ? "When you leave, all participants will be kicked out"
        : "Guests can continue after you leave",
    })
  }

  const handleCaptionsToggle = (enabled: boolean) => {
    setCaptionsEnabled(enabled)
    onCaptionsChange(enabled, captionLanguage)

    if (enabled) {
      toast({
        title: "Captions Enabled",
        description: "Live captions are now active",
      })
    }
  }

  const handleLanguageChange = (language: string) => {
    setCaptionLanguage(language)
    if (captionsEnabled) {
      onCaptionsChange(true, language)
    }
  }

  return (
    <div className="space-y-6">
      {/* Captions Section */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-1">Live Captions</h4>
          <p className="text-sm text-muted-foreground">Enable real-time speech-to-text captions</p>
        </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="captions">Enable Captions</Label>
              <Switch id="captions" checked={captionsEnabled} onCheckedChange={handleCaptionsToggle} />
            </div>

            {captionsEnabled && (
              <div className="space-y-2">
                <Label>Caption Language</Label>
                <Select value={captionLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                    <SelectItem value="de-DE">German</SelectItem>
                    <SelectItem value="it-IT">Italian</SelectItem>
                    <SelectItem value="ja-JP">Japanese</SelectItem>
                    <SelectItem value="ko-KR">Korean</SelectItem>
                    <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                    <SelectItem value="vi-VN">Vietnamese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Translation Section */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Auto Translation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Automatically translate captions to your preferred language
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="translate">Enable Translation</Label>
              <Switch
                id="translate"
                checked={translateEnabled}
                onCheckedChange={setTranslateEnabled}
                disabled={!captionsEnabled}
              />
            </div>

            {translateEnabled && captionsEnabled && (
              <div className="space-y-2">
                <Label>Translate To</Label>
                <Select value={translateLanguage} onValueChange={setTranslateLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {isOwner && (
            <>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Room Controls (Owner Only)</h4>
                  <p className="text-sm text-muted-foreground mb-4">Manage what happens when you end the call</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="end-for-all">End Meeting for All</Label>
                    <p className="text-xs text-muted-foreground">Kick all users when you leave</p>
                  </div>
                  <Switch id="end-for-all" checked={endCallForAll} onCheckedChange={handleEndForAllChange} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Room Type</h4>
                  <p className="text-sm text-muted-foreground mb-4">Change the mode of this meeting</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["voice", "video", "team", "group"].map((type) => (
                    <Button
                      key={type}
                      variant={roomType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRoomTypeChange(type)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

      {/* Room Info */}
      <div className="space-y-2 pt-2">
        <h4 className="font-medium">Room Information</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Chat history saved for 60 days</p>
          <p>• Call history tracked automatically</p>
          <p>• Files scanned with VirusTotal</p>
          <p>• Maximum file size: 5MB</p>
        </div>
      </div>
    </div>
  )
}
