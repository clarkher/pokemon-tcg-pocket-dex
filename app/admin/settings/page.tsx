"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "寶可夢集換式卡牌資料庫",
    siteDescription: "一個全面的寶可夢集換式卡牌遊戲資訊平台",
    contactEmail: "admin@pokemon-tcg-pocket-dex.com",
    enableRegistration: true,
    enableComments: true,
    enableLikes: true,
  })

  const [apiSettings, setApiSettings] = useState({
    apiKey: "pk_test_51NzUBDCj0Uh1Ij0U2Ij0Uh1Ij0Uh1Ij0Uh1Ij0Uh1Ij0Uh1Ij0Uh1Ij0U",
    apiEndpoint: "https://api.pokemon-tcg-pocket-dex.com",
    requestLimit: "100",
    enableCaching: true,
  })

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleGeneralSwitchChange = (name: string, checked: boolean) => {
    setGeneralSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleApiSwitchChange = (name: string, checked: boolean) => {
    setApiSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("一般設置已提交:", generalSettings)
    // 這裡通常會將數據發送到 API
    alert("一般設置保存成功！")
  }

  const handleApiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("API設置已提交:", apiSettings)
    // 這裡通常會將數據發送到 API
    alert("API設置保存成功！")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">系統設置</h1>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">一般設置</TabsTrigger>
          <TabsTrigger value="api">API設置</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <form onSubmit={handleGeneralSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>一般設置</CardTitle>
                <CardDescription>
                  管理您網站的一般設置。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">網站名稱</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">網站描述</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">聯繫郵箱</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableRegistration">啟用用戶註冊</Label>
                  <Switch
                    id="enableRegistration"
                    checked={generalSettings.enableRegistration}
                    onCheckedChange={(checked) => handleGeneralSwitchChange("enableRegistration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableComments">啟用評論功能</Label>
                  <Switch
                    id="enableComments"
                    checked={generalSettings.enableComments}
                    onCheckedChange={(checked) => handleGeneralSwitchChange("enableComments", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableLikes">啟用點讚功能</Label>
                  <Switch
                    id="enableLikes"
                    checked={generalSettings.enableLikes}
                    onCheckedChange={(checked) => handleGeneralSwitchChange("enableLikes", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">保存更改</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="api">
          <form onSubmit={handleApiSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>API設置</CardTitle>
                <CardDescription>
                  配置您的API設置和訪問權限。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API密鑰</Label>
                  <Input
                    id="apiKey"
                    name="apiKey"
                    value={apiSettings.apiKey}
                    onChange={handleApiChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API端點</Label>
                  <Input
                    id="apiEndpoint"
                    name="apiEndpoint"
                    value={apiSettings.apiEndpoint}
                    onChange={handleApiChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestLimit">請求限制（每分鐘）</Label>
                  <Input
                    id="requestLimit"
                    name="requestLimit"
                    type="number"
                    value={apiSettings.requestLimit}
                    onChange={handleApiChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableCaching">啟用API緩存</Label>
                  <Switch
                    id="enableCaching"
                    checked={apiSettings.enableCaching}
                    onCheckedChange={(checked) => handleApiSwitchChange("enableCaching", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">保存API設置</Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

