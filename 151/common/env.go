package common

import (
	"os"
	"strings"
	"math/rand"
	"time"
)

var (
	// is debug
	IS_DEBUG_MODE bool
	// user token
	USER_TOKEN_ENV_NAME_PREFIX = "Go_Proxy_BingAI_USER_TOKEN"
	USER_TOKEN_LIST            []string
	// USer Cookie
	USER_KievRPSSecAuth string
	USER_RwBf           string
	USER_MUID           string
	// 访问权限密钥，可选
	AUTH_KEY             string
	AUTH_KEY_COOKIE_NAME = "BingAI_Auth_Key"
)

func init() {
	initEnv()
	initUserToken()
}

func generateRandomString(length int) string {
	charset := "ABCDEF1234567890"
	rand.Seed(time.Now().UnixNano())

	result := make([]byte, length)
	for i := 0; i < length; i++ {
		result[i] = charset[rand.Intn(len(charset))]
	}

	return string(result)
}

func initEnv() {
	// is debug
	IS_DEBUG_MODE = os.Getenv("Go_Proxy_BingAI_Debug") != ""
	// auth
	AUTH_KEY = os.Getenv("Go_Proxy_BingAI_AUTH_KEY")
	// KievRPSSecAuth Cookie
	USER_KievRPSSecAuth = os.Getenv("USER_KievRPSSecAuth")
	// MUID Cookie
	USER_MUID = os.Getenv("USER_MUID")
	if USER_MUID == "" {
		IPSTR := "074AD7F106536BC6392FC4C907CA6A" // Replace with your desired IPV6 address
		randomString := generateRandomString(2)
		USER_MUID = IPSTR + randomString
	}
	// _RwBf Cookie
	USER_RwBf = os.Getenv("USER_RwBf")
}

func initUserToken() {
	for _, env := range os.Environ() {
		if strings.HasPrefix(env, USER_TOKEN_ENV_NAME_PREFIX) {
			parts := strings.SplitN(env, "=", 2)
			USER_TOKEN_LIST = append(USER_TOKEN_LIST, parts[1])
		}
	}
}
