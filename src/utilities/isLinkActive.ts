/**
 * Payload Link 类型定义（从 payload-types 中提取）
 * 使用更宽松的类型以兼容 Payload 的实际类型
 */
type LinkType = {
  type?: ('reference' | 'custom') | null
  newTab?: boolean | null
  reference?:
    | ({
        relationTo: 'pages' | 'posts'
        value: number | { slug?: string | null; [key: string]: unknown } | unknown
      } | null)
    | null
  url?: string | null
  label: string
  appearance?: ('default' | 'outline') | null
}

/**
 * 判断链接是否匹配当前路径
 * @param link - Payload 链接对象
 * @param pathname - 当前路径（来自 usePathname()）
 * @returns 如果链接匹配当前路径，返回 true；否则返回 false
 */
export const isLinkActive = (link: LinkType, pathname: string): boolean => {
  // 主页不显示下划线
  if (pathname === '/') return false

  // 处理 custom 类型链接
  if (link.type === 'custom' && link.url) {
    // 规范化路径：移除末尾斜杠进行比较
    const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
      ? pathname.slice(0, -1) 
      : pathname
    const normalizedUrl = link.url.endsWith('/') && link.url !== '/' 
      ? link.url.slice(0, -1) 
      : link.url
    return normalizedPathname === normalizedUrl
  }

  // 处理 reference 类型链接
  if (link.type === 'reference' && link.reference?.value) {
    const ref = link.reference.value
    if (typeof ref === 'object' && ref !== null && 'slug' in ref) {
      const slug = ref.slug
      const relationTo = link.reference.relationTo
      const expectedPath = relationTo === 'pages' ? `/${slug}` : `/${relationTo}/${slug}`
      
      // 规范化路径比较
      const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
        ? pathname.slice(0, -1) 
        : pathname
      const normalizedExpectedPath = expectedPath.endsWith('/') && expectedPath !== '/' 
        ? expectedPath.slice(0, -1) 
        : expectedPath
      
      return normalizedPathname === normalizedExpectedPath
    }
  }

  return false
}

