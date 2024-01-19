package main

import (
    "fmt"
    "net/http"
    "regexp"
    "strings"
)

// 定义一个函数，接受stringValues和URL作为参数
func extractText(sv, url string) {
    // 访问网址，获取响应
    resp, err := http.Get(url)
    if err != nil {
        fmt.Println("访问网址出错:", err)
        return
    }
    defer resp.Body.Close()

    // 使用正则表达式提取单引号括起的文本
    re := regexp.MustCompile(`'([^']*)'`)
    matches := re.FindAllString(sv, -1)
    if matches == nil {
        fmt.Println("没有找到匹配的文本")
        return
    }

    // 去掉单引号，打印结果
    for _, match := range matches {
        text := strings.Trim(match, "'")
        fmt.Println(text)
    }
}

func main() {
    // 从环境变量中读取网址
    url := os.Getenv("URL")
    if url == "" {
        fmt.Println("没有找到网址")
        return
    }

    // 从环境变量中读取stringValues
    sv := os.Getenv("StringValues")
    if sv == "" {
        fmt.Println("没有找到StringValues")
        return
    }

    // 调用函数，传入stringValues和URL
    extractText(sv, url)
}
