import sys
import urllib.parse

# --- תיקון קידוד עברית עבור חלון הפקודות של ווינדוס ---
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# הקוד המדויק והרשמי מהצילום מסך שלך!
ADMITAD_BASE_URL = "https://rzekl.com/g/1e8d114494f4b1eb315016525dc3e8/"

def get_smart_deal_link(keyword):
    # 1. יצירת קישור החיפוש הבסיסי של עליאקספרס עבור המילה המבוקשת
    encoded_keyword = urllib.parse.quote(keyword)
    target_url = f"https://www.aliexpress.com/wholesale?SearchText={encoded_keyword}"
    
    # 2. קידוד הקישור של עליאקספרס
    encoded_target_url = urllib.parse.quote(target_url)
    
    # 3. בניית קישור השותפים המדויק
    affiliate_link = f"{ADMITAD_BASE_URL}?ulp={encoded_target_url}"
    
    # 4. בניית ההודעה לווטסאפ
    message = f"🛍️ *מצאתי דילים מעולים עבור: {keyword}* 🛍️\n\n"
    message += f"ריכזתי עבורך את כל המבצעים המובילים עם הדירוגים הכי גבוהים בעליאקספרס!\n\n"
    message += f"🔗 *לצפייה במוצרים ורכישה:* {affiliate_link}\n\n"
    message += "גלישה נעימה! אל תשכחו לעקוב לעוד דילים שווים ✨"
    
    return message

if __name__ == "__main__":
    search_keyword = sys.argv[1] if len(sys.argv) > 1 else "שעון חכם"
    print(get_smart_deal_link(search_keyword))