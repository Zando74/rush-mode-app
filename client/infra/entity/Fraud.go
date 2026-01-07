package entity

type Mail struct {
	PlayerName string `json:"playerName"`
	Sender string `json:"sender"`
	GoldTaken int `json:"goldTaken"`
	Attachments []ItemAttachment `json:"attachments"`
	Timestamp int `json:"timestamp"`
}

type Trade struct {
	PlayerName string `json:"playerName"`
	Giver string `json:"giver"`
	GoldReceived int `json:"goldReceived"`
	Items []ItemAttachment `json:"items"`
	Timestamp int `json:"timestamp"`
}

type ItemAttachment struct {
	Id int `json:"id"`
	Quantity int `json:"quantity"`
}