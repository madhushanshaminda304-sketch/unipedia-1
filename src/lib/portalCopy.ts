import { copy } from "./ui";
export function portalCopy(lang: string) {
  const base = copy(lang),
    en = {
      explore: "Explore",
      institutions: "Institutions",
      ugc: "UGC course finder",
      guides: "Guides",
      search: "Search",
      placeholder: "Course, subject or institution",
      subtitle: "Explore degrees, diplomas and foundations across Sri Lanka.",
      ugcDegrees: "UGC programmes",
      otherDegrees: "Private & other programmes",
      diplomas: "Diplomas & HNDs",
      foundations: "Foundations",
      english:
        "Programme research and guides are currently available in English.",
    };
  const si: typeof en = {
    explore: "පාඨමාලා බලන්න",
    institutions: "ආයතන",
    ugc: "UGC පාඨමාලා සොයන්න",
    guides: "මාර්ගෝපදේශ",
    search: "සොයන්න",
    placeholder: "පාඨමාලාව හෝ ආයතනය",
    subtitle: "ශ්‍රී ලංකාවේ උපාධි, ඩිප්ලෝමා සහ පදනම් පාඨමාලා සොයන්න.",
    ugcDegrees: "UGC උපාධි",
    otherDegrees: "වෙනත් උපාධි",
    diplomas: "ඩිප්ලෝමා සහ HND",
    foundations: "පදනම් පාඨමාලා",
    english:
      "පාඨමාලා පර්යේෂණ තොරතුරු සහ මාර්ගෝපදේශ දැනට ඉංග්‍රීසි භාෂාවෙන් ඇත.",
  };
  const ta: typeof en = {
    explore: "பாடநெறிகளை ஆராய்க",
    institutions: "நிறுவனங்கள்",
    ugc: "UGC பாடநெறித் தேடல்",
    guides: "வழிகாட்டிகள்",
    search: "தேடுக",
    placeholder: "பாடநெறி அல்லது நிறுவனம்",
    subtitle:
      "இலங்கையில் பட்டம், டிப்ளோமா மற்றும் அடிப்படைப் பாடநெறிகளை ஆராயுங்கள்.",
    ugcDegrees: "UGC பட்டங்கள்",
    otherDegrees: "பிற பட்டங்கள்",
    diplomas: "டிப்ளோமா & HND",
    foundations: "அடிப்படைப் பாடநெறிகள்",
    english:
      "பாடநெறி ஆய்வுத் தகவல்களும் வழிகாட்டிகளும் தற்போது ஆங்கிலத்தில் உள்ளன.",
  };
  return { ...base, ...(lang === "SI" ? si : lang === "TA" ? ta : en) };
}
