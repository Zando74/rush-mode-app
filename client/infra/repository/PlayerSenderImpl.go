package repository

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"rush-mode-tracker/infra/entity"
)


var (
	BACKEND_URL = ""
	API_KEY = ""
)

const (
	PlayersStatusUpdate = "/rush-characters/players-status-update"
	registerRushFraudEmail = "/rush-fraud/register-rush-fraud-email"
    registerRushFraudTrade = "/rush-fraud/register-rush-fraud-trade"
	registerRushProgressionEvents = "/rush-progression/register-rush-progression-events"
)

type PlayerSenderImpl struct {}

type PlayerPayload struct {
	RushId string `json:"rushId"`
	Characters []entity.Player `json:"characters"`
}

type ProgressionPayload struct {
	RushId string `json:"rushId"`
	Progressions []entity.Progression `json:"progressions"`
}

type FraudMailPayload struct {
	RushId string `json:"rushId"`
	Mails []entity.Mail `json:"mails"`
}

type FraudTradePayload struct {
	RushId string `json:"rushId"`
	Trades []entity.Trade `json:"trades"`
}

func (p *PlayerSenderImpl) SendPlayerStatusUpdate(rushId string, players []entity.Player) {
	playerPayload := PlayerPayload{
		RushId: rushId,
		Characters: players,
	}
	playerData, err := json.Marshal(playerPayload)
	
	if err != nil {
		log.Fatalf("Failed to marshal players: %v", err)
	}
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	req, err := http.NewRequest(
		"POST", 
		BACKEND_URL + PlayersStatusUpdate,
		bytes.NewBuffer(playerData),
	)
	if err != nil {
		log.Fatalf("[RUSH-MODE-TRACKER]  Failed to create request")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", API_KEY)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		log.Println("[RUSH-MODE-TRACKER] Send Player Status Update Request failed")

	}
	defer resp.Body.Close()

	message, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("[RUSH-MODE-TRACKER] Failed to read response body")
	}

	if resp.StatusCode != http.StatusOK {
		log.Println("[RUSH-MODE-TRACKER] Bad response status: " + resp.Status)
		log.Printf("[RUSH-MODE-TRACKER] Response body: %s", message)
	} else {
		log.Println("[RUSH-MODE-TRACKER] Players sent successfully")
	}
}

func (p *PlayerSenderImpl) SendFraudMail(rushId string, mails []entity.Mail) {
	fraudMailPayload := FraudMailPayload{
		RushId: rushId,
		Mails: mails,
	}
	mailData, err := json.Marshal(fraudMailPayload)
	if err != nil {
		log.Fatalf("Failed to marshal mails: %v", err)
	}
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	req, err := http.NewRequest(
		"POST", 
		BACKEND_URL + registerRushFraudEmail,
		bytes.NewBuffer(mailData),
	)
	if err != nil {
		log.Fatalf("[RUSH-MODE-TRACKER]  Failed to create request")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", API_KEY)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		log.Println("[RUSH-MODE-TRACKER] Send Fraud Mails  Request failed")

	}
	defer resp.Body.Close()

	message, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("[RUSH-MODE-TRACKER] Failed to read response body")
	}

	if resp.StatusCode != http.StatusOK {
		log.Println("[RUSH-MODE-TRACKER] Bad response status: " + resp.Status)
		log.Printf("[RUSH-MODE-TRACKER] Response body: %s", message)
	} else {
		log.Println("[RUSH-MODE-TRACKER] Fraud mails sent successfully")
	}
}

func (p *PlayerSenderImpl) SendFraudTrade(rushId string, trades []entity.Trade) {
	fraudTradePayload := FraudTradePayload{
		RushId: rushId,
		Trades: trades,
	}
	tradeData, err := json.Marshal(fraudTradePayload)
	if err != nil {
		log.Fatalf("Failed to marshal trades: %v", err)
	}
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	req, err := http.NewRequest(
		"POST", 
		BACKEND_URL + registerRushFraudTrade,
		bytes.NewBuffer(tradeData),
	)
	if err != nil {
		log.Fatalf("[RUSH-MODE-TRACKER]  Failed to create request")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", API_KEY)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		log.Println("[RUSH-MODE-TRACKER] Send Fraud Trade Request failed")

	}
	defer resp.Body.Close()

	message, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("[RUSH-MODE-TRACKER] Failed to read response body")
	}

	if resp.StatusCode != http.StatusOK {
		log.Println("[RUSH-MODE-TRACKER] Bad response status: " + resp.Status)
		log.Printf("[RUSH-MODE-TRACKER] Response body: %s", message)
	} else {
		log.Println("[RUSH-MODE-TRACKER] Fraud trades sent successfully")
	}
}

func (p *PlayerSenderImpl) SendProgression(rushId string, progressions []entity.Progression) {
	progressionPayload := ProgressionPayload{
		RushId: rushId,
		Progressions: progressions,
	}
	progressionData, err := json.Marshal(progressionPayload)
	if err != nil {
		log.Fatalf("Failed to marshal progressions: %v", err)
	}
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	req, err := http.NewRequest(
		"POST", 
		BACKEND_URL + registerRushProgressionEvents,
		bytes.NewBuffer(progressionData),
	)
	if err != nil {
		log.Fatalf("[RUSH-MODE-TRACKER]  Failed to create request")
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", API_KEY)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		log.Println("[RUSH-MODE-TRACKER] Send Progression Request failed")

	}
	defer resp.Body.Close()

	message, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("[RUSH-MODE-TRACKER] Failed to read response body")
	}

	if resp.StatusCode != http.StatusOK {
		log.Println("[RUSH-MODE-TRACKER] Bad response status: " + resp.Status)
		log.Printf("[RUSH-MODE-TRACKER] Response body: %s", message)
	} else {
		log.Println("[RUSH-MODE-TRACKER] Progressions sent successfully")
	}
}


func (p *PlayerSenderImpl) SendBatch(players []entity.Player, progressions []entity.Progression, fraudMails []entity.Mail, fraudTrades []entity.Trade, rushId string) {
	p.SendPlayerStatusUpdate(rushId, players)
	p.SendProgression(rushId, progressions)
	p.SendFraudMail(rushId, fraudMails)
	p.SendFraudTrade(rushId, fraudTrades)
}