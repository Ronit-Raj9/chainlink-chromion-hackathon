"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Gauge, Coins, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { SettingsCard } from "./settings-card"

export function TransactionSettings() {
  const { toast } = useToast()
  const [gasPreference, setGasPreference] = useState("medium")
  const [transactionSpeed, setTransactionSpeed] = useState("standard")
  const [customGasPrice, setCustomGasPrice] = useState("50")
  const [gasMultiplier, setGasMultiplier] = useState(1.5)
  const [autoAdjust, setAutoAdjust] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Gas price estimates based on network conditions
  const gasPrices = {
    low: "35",
    medium: "50",
    high: "75",
    custom: customGasPrice,
  }

  // Transaction speed estimates
  const speedEstimates = {
    economic: "~5-10 mins",
    standard: "~1-3 mins",
    fast: "~30-60 secs",
    instant: "~10-30 secs",
  }

  const handleSavePreferences = () => {
    // Here you would save the preferences to your backend or local storage
    toast({
      title: "Preferences Saved",
      description: "Your gas and transaction preferences have been updated.",
    })
  }

  const getEstimatedTime = () => {
    if (transactionSpeed === "economic") return speedEstimates.economic
    if (transactionSpeed === "standard") return speedEstimates.standard
    if (transactionSpeed === "fast") return speedEstimates.fast
    return speedEstimates.instant
  }

  const getEstimatedCost = () => {
    const baseGas = gasPrices[gasPreference as keyof typeof gasPrices]
    const multiplier =
      transactionSpeed === "economic"
        ? 0.8
        : transactionSpeed === "standard"
          ? 1
          : transactionSpeed === "fast"
            ? 1.2
            : 1.5

    return `~${(Number.parseFloat(baseGas) * multiplier).toFixed(2)} Gwei`
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="space-y-6">
        <SettingsCard
          icon={<Gauge className="h-5 w-5" />}
          title="Transaction Speed"
          description="Choose how quickly you want your transactions to be processed"
          action={<Button onClick={handleSavePreferences}>Save Preferences</Button>}
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Select Transaction Speed</Label>
              <RadioGroup
                value={transactionSpeed}
                onValueChange={setTransactionSpeed}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    transactionSpeed === "economic"
                      ? "border-green-500 bg-green-950/20"
                      : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="economic" id="economic" className="sr-only" />
                  <Label htmlFor="economic" className="flex cursor-pointer items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Economic</span>
                    </div>
                    <span className="text-xs text-green-500">{speedEstimates.economic}</span>
                  </Label>
                  <p className="text-xs text-gray-400">Lowest cost, longer wait times</p>
                </div>

                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    transactionSpeed === "standard"
                      ? "border-blue-500 bg-blue-950/20"
                      : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="standard" id="standard" className="sr-only" />
                  <Label htmlFor="standard" className="flex cursor-pointer items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>Standard</span>
                    </div>
                    <span className="text-xs text-blue-500">{speedEstimates.standard}</span>
                  </Label>
                  <p className="text-xs text-gray-400">Balanced cost and speed</p>
                </div>

                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    transactionSpeed === "fast"
                      ? "border-purple-500 bg-purple-950/20"
                      : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="fast" id="fast" className="sr-only" />
                  <Label htmlFor="fast" className="flex cursor-pointer items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <span>Fast</span>
                    </div>
                    <span className="text-xs text-purple-500">{speedEstimates.fast}</span>
                  </Label>
                  <p className="text-xs text-gray-400">Higher cost, faster confirmation</p>
                </div>

                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    transactionSpeed === "instant" ? "border-pink-500 bg-pink-950/20" : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="instant" id="instant" className="sr-only" />
                  <Label htmlFor="instant" className="flex cursor-pointer items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-pink-500" />
                      <span>Instant</span>
                    </div>
                    <span className="text-xs text-pink-500">{speedEstimates.instant}</span>
                  </Label>
                  <p className="text-xs text-gray-400">Highest priority, fastest confirmation</p>
                </div>
              </RadioGroup>
            </div>

            <div className="rounded-md border border-blue-800 bg-blue-950/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Estimated Confirmation Time</h4>
                  <p className="text-xs text-gray-400">Based on current network conditions</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{getEstimatedTime()}</p>
                  <p className="text-xs text-gray-400">Estimated Cost: {getEstimatedCost()}</p>
                </div>
              </div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<Coins className="h-5 w-5" />}
          title="Gas Price Preferences"
          description="Set your preferred gas price strategy for transactions"
          action={
            <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? "Hide Advanced" : "Show Advanced"}
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Gas Price Strategy</Label>
              <RadioGroup
                value={gasPreference}
                onValueChange={setGasPreference}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    gasPreference === "low" ? "border-green-500 bg-green-950/20" : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="low" id="low" className="sr-only" />
                  <Label htmlFor="low" className="flex cursor-pointer items-center justify-between">
                    <span>Low</span>
                    <span className="text-xs text-green-500">{gasPrices.low} Gwei</span>
                  </Label>
                  <p className="text-xs text-gray-400">Economical option, may take longer</p>
                </div>

                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    gasPreference === "medium" ? "border-blue-500 bg-blue-950/20" : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="medium" id="medium" className="sr-only" />
                  <Label htmlFor="medium" className="flex cursor-pointer items-center justify-between">
                    <span>Medium</span>
                    <span className="text-xs text-blue-500">{gasPrices.medium} Gwei</span>
                  </Label>
                  <p className="text-xs text-gray-400">Recommended for most transactions</p>
                </div>

                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    gasPreference === "high" ? "border-purple-500 bg-purple-950/20" : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="high" id="high" className="sr-only" />
                  <Label htmlFor="high" className="flex cursor-pointer items-center justify-between">
                    <span>High</span>
                    <span className="text-xs text-purple-500">{gasPrices.high} Gwei</span>
                  </Label>
                  <p className="text-xs text-gray-400">Faster confirmation, higher cost</p>
                </div>

                <div
                  className={`flex flex-col space-y-2 rounded-md border p-4 ${
                    gasPreference === "custom" ? "border-pink-500 bg-pink-950/20" : "border-blue-800 bg-blue-950/10"
                  }`}
                >
                  <RadioGroupItem value="custom" id="custom" className="sr-only" />
                  <Label htmlFor="custom" className="flex cursor-pointer items-center justify-between">
                    <span>Custom</span>
                    <span className="text-xs text-pink-500">{customGasPrice} Gwei</span>
                  </Label>
                  <p className="text-xs text-gray-400">Set your own gas price</p>
                </div>
              </RadioGroup>
            </div>

            {gasPreference === "custom" && (
              <div className="space-y-3">
                <Label htmlFor="custom-gas">Custom Gas Price (Gwei)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="custom-gas"
                    type="number"
                    min="1"
                    value={customGasPrice}
                    onChange={(e) => setCustomGasPrice(e.target.value)}
                    className="w-24 bg-blue-950/30 border-blue-800"
                  />
                  <Slider
                    value={[Number.parseFloat(customGasPrice)]}
                    min={10}
                    max={200}
                    step={1}
                    onValueChange={(value) => setCustomGasPrice(value[0].toString())}
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-adjust" className="text-sm font-medium">
                  Auto-adjust to network conditions
                </Label>
                <p className="text-xs text-gray-400">Automatically adjust gas prices based on network congestion</p>
              </div>
              <Switch id="auto-adjust" checked={autoAdjust} onCheckedChange={setAutoAdjust} />
            </div>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 rounded-md border border-blue-800 bg-blue-950/30 p-4"
              >
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Settings2 className="h-4 w-4" />
                  Advanced Settings
                </h4>

                <div className="space-y-3">
                  <Label htmlFor="gas-multiplier">Gas Price Multiplier</Label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">{gasMultiplier.toFixed(1)}x</span>
                    <Slider
                      id="gas-multiplier"
                      value={[gasMultiplier]}
                      min={1}
                      max={3}
                      step={0.1}
                      onValueChange={(value) => setGasMultiplier(value[0])}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Multiplier applied to base gas price for priority transactions
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Default Gas Limits</Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="token-transfer" className="text-xs">
                        Token Transfer
                      </Label>
                      <Input
                        id="token-transfer"
                        type="number"
                        defaultValue="65000"
                        className="bg-blue-950/30 border-blue-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swap" className="text-xs">
                        Token Swap
                      </Label>
                      <Input id="swap" type="number" defaultValue="200000" className="bg-blue-950/30 border-blue-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bridge" className="text-xs">
                        Bridge Transaction
                      </Label>
                      <Input
                        id="bridge"
                        type="number"
                        defaultValue="350000"
                        className="bg-blue-950/30 border-blue-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract" className="text-xs">
                        Contract Interaction
                      </Label>
                      <Input
                        id="contract"
                        type="number"
                        defaultValue="150000"
                        className="bg-blue-950/30 border-blue-800"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </SettingsCard>
      </div>
    </motion.div>
  )
}
