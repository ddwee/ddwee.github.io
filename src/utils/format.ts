import { DateTime } from 'luxon'
import { PandaConfig } from '../config.js'
const { defaultLocale } = PandaConfig

export function relativeTo(dateStr: string, locale = 'ja') {
    locale ??= 'ja'
    locale = defaultLocale // force to default language
    return DateTime.fromISO(dateStr).toRelative({
        base: DateTime.now(),
        locale: locale
    })
}

export function formatDateMD(dateStr: string, locale: string = 'ja') {
    const date = DateTime.fromISO(dateStr)
    locale = defaultLocale // force to default language
    if (locale === 'en') {
        return date.setLocale(locale).toFormat('d, MMM')
    }
    return date.toFormat('M月d日')
}

export function formatDateYMD(dateString: string, locale: string = 'ja') {
    locale = defaultLocale // force to default language
    const date = DateTime.fromISO(dateString)
    if (locale === 'en') {
        return date.setLocale(locale).toFormat('d, MMM, yyyy')
    }
    return date.toFormat('yyyy年M月d日')
}

export function slugifySpace(old: string) {
    return old.replace(/\s/g, '-')
}
