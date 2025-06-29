import zh from '../locales/zh.yml'
import en from '../locales/en.yml'
import ja from '../locales/ja.yml'
import get from 'lodash/get'
import { PandaConfig } from '../config.js'

const { defaultLocale } = PandaConfig

// 対応言語の定義
const supportedLocales = ['zh', 'en', 'ja']

const useLocalePath = (lang: string) => {
    lang ??= ''
    
    // デフォルト言語（中国語）の場合はパスプレフィックスなし
    if (lang === 'zh') {
        lang = ''
    }
    
    // 各言語のパスプレフィックスを設定
    let start = ''
    if (lang === 'en') {
        start = '/en'
    } else if (lang === 'ja') {
        start = '/ja'
    }
    
    return (path: string) => {
        let url = start + path
        if (!url.endsWith('/')) url += '/'
        return url
    }
}

const useTranslation = (lang: string) => {
    if (!lang || !supportedLocales.includes(lang)) {
        lang = 'zh' // デフォルト言語
    }
    
    return (key: string) => {
        // 翻訳データの優先順位を設定
        let data
        switch (lang) {
            case 'zh':
                data = [zh, en, ja] // 中国語 > 英語 > 日本語
                break
            case 'en':
                data = [en, zh, ja] // 英語 > 中国語 > 日本語
                break
            case 'ja':
                data = [ja, zh, en] // 日本語 > 中国語 > 英語
                break
            default:
                data = [zh, en, ja]
        }
        
        // 翻訳キーを順番に検索
        for (const langData of data) {
            const result = get(langData, key)
            if (result) {
                return result
            }
        }
        
        // 翻訳が見つからない場合の警告とフォールバック
        console.warn(`Translation for "${key}" not found in any language`)
        return key.split('.').pop()
    }
}

// URLから言語を判定する関数
const detectLocaleFromUrl = (url: URL) => {
    const pathname = url.pathname
    
    if (pathname.startsWith('/en/') || pathname === '/en') {
        return 'en'
    } else if (pathname.startsWith('/ja/') || pathname === '/ja') {
        return 'ja'
    } else {
        return 'zh' // デフォルト
    }
}

export const useLocale = (url: URL) => {
    // URLから言語を自動検出（強制的にデフォルト言語にする場合は下の行をコメントアウト）
    const locale = detectLocaleFromUrl(url)
    // const locale = defaultLocale // 強制的にデフォルト言語にする場合
    
    return {
        path: useLocalePath(locale),
        t: useTranslation(locale),
        locale,
        supportedLocales // サポートされている言語のリストも返す
    }
}
