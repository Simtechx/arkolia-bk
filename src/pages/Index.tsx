
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Share2, FileText, Settings, Image as ImageIcon, Filter, Search, X, Palette, ChevronDown, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from '@/hooks/use-toast';

// Complete list of all 114 Surahs with comprehensive metadata
const surahs = [
  { id: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", verses: 7, type: "Makkan", length: "Short", juz: 1, themes: ["Tawheed", "Worship", "Duas"], usage: ["Daily", "Salah"], openingStyle: "Praise", sajdah: false },
  { id: 2, name: "Al-Baqarah", nameArabic: "البقرة", verses: 286, type: "Medinan", length: "Long", juz: 1, themes: ["Laws", "Stories", "Commands"], usage: ["Friday"], openingStyle: "Letters", sajdah: false },
  { id: 3, name: "Aal-E-Imran", nameArabic: "آل عمران", verses: 200, type: "Medinan", length: "Long", juz: 3, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 4, name: "An-Nisa", nameArabic: "النساء", verses: 176, type: "Medinan", length: "Long", juz: 4, themes: ["Laws", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 5, name: "Al-Maidah", nameArabic: "المائدة", verses: 120, type: "Medinan", length: "Medium", juz: 6, themes: ["Laws", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 6, name: "Al-An'am", nameArabic: "الأنعام", verses: 165, type: "Makkan", length: "Long", juz: 7, themes: ["Tawheed", "Stories"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 7, name: "Al-A'raf", nameArabic: "الأعراف", verses: 206, type: "Makkan", length: "Long", juz: 8, themes: ["Stories", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 8, name: "Al-Anfal", nameArabic: "الأنفال", verses: 75, type: "Medinan", length: "Medium", juz: 9, themes: ["Commands", "Laws"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 9, name: "At-Tawbah", nameArabic: "التوبة", verses: 129, type: "Medinan", length: "Medium", juz: 10, themes: ["Commands", "Laws"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 10, name: "Yunus", nameArabic: "يونس", verses: 109, type: "Makkan", length: "Medium", juz: 11, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 11, name: "Hud", nameArabic: "هود", verses: 123, type: "Makkan", length: "Medium", juz: 11, themes: ["Stories", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 12, name: "Yusuf", nameArabic: "يوسف", verses: 111, type: "Makkan", length: "Medium", juz: 12, themes: ["Stories", "Lessons"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 13, name: "Ar-Ra'd", nameArabic: "الرعد", verses: 43, type: "Medinan", length: "Short", juz: 13, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 14, name: "Ibrahim", nameArabic: "ابراهيم", verses: 52, type: "Makkan", length: "Short", juz: 13, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 15, name: "Al-Hijr", nameArabic: "الحجر", verses: 99, type: "Makkan", length: "Medium", juz: 14, themes: ["Stories", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 16, name: "An-Nahl", nameArabic: "النحل", verses: 128, type: "Makkan", length: "Medium", juz: 14, themes: ["Tawheed", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: true },
  { id: 17, name: "Al-Isra", nameArabic: "الإسراء", verses: 111, type: "Makkan", length: "Medium", juz: 15, themes: ["Stories", "Commands"], usage: ["Daily"], openingStyle: "Praise", sajdah: true },
  { id: 18, name: "Al-Kahf", nameArabic: "الكهف", verses: 110, type: "Makkan", length: "Medium", juz: 15, themes: ["Stories", "Lessons"], usage: ["Friday", "Protection"], openingStyle: "Praise", sajdah: false },
  { id: 19, name: "Maryam", nameArabic: "مريم", verses: 98, type: "Makkan", length: "Medium", juz: 16, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 20, name: "Taha", nameArabic: "طه", verses: 135, type: "Makkan", length: "Medium", juz: 16, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 21, name: "Al-Anbiya", nameArabic: "الأنبياء", verses: 112, type: "Makkan", length: "Medium", juz: 17, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: true },
  { id: 22, name: "Al-Hajj", nameArabic: "الحج", verses: 78, type: "Medinan", length: "Medium", juz: 17, themes: ["Worship", "Hajj"], usage: ["Hajj"], openingStyle: "Commands", sajdah: true },
  { id: 23, name: "Al-Mu'minun", nameArabic: "المؤمنون", verses: 118, type: "Makkan", length: "Medium", juz: 18, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 24, name: "An-Nur", nameArabic: "النور", verses: 64, type: "Medinan", length: "Medium", juz: 18, themes: ["Laws", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 25, name: "Al-Furqan", nameArabic: "الفرقان", verses: 77, type: "Makkan", length: "Medium", juz: 18, themes: ["Tawheed", "Stories"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 26, name: "Ash-Shu'ara", nameArabic: "الشعراء", verses: 227, type: "Makkan", length: "Long", juz: 19, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 27, name: "An-Naml", nameArabic: "النمل", verses: 93, type: "Makkan", length: "Medium", juz: 19, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 28, name: "Al-Qasas", nameArabic: "القصص", verses: 88, type: "Makkan", length: "Medium", juz: 20, themes: ["Stories", "Lessons"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 29, name: "Al-Ankabut", nameArabic: "العنكبوت", verses: 69, type: "Makkan", length: "Medium", juz: 20, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 30, name: "Ar-Rum", nameArabic: "الروم", verses: 60, type: "Makkan", length: "Medium", juz: 21, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 31, name: "Luqman", nameArabic: "لقمان", verses: 34, type: "Makkan", length: "Short", juz: 21, themes: ["Lessons", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 32, name: "As-Sajdah", nameArabic: "السجدة", verses: 30, type: "Makkan", length: "Short", juz: 21, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 33, name: "Al-Ahzab", nameArabic: "الأحزاب", verses: 73, type: "Medinan", length: "Medium", juz: 21, themes: ["Laws", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 34, name: "Saba", nameArabic: "سبأ", verses: 54, type: "Makkan", length: "Medium", juz: 22, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 35, name: "Fatir", nameArabic: "فاطر", verses: 45, type: "Makkan", length: "Short", juz: 22, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 36, name: "Ya-Sin", nameArabic: "يس", verses: 83, type: "Makkan", length: "Medium", juz: 22, themes: ["Tawheed", "Qiyamah"], usage: ["Before Sleep", "Protection"], openingStyle: "Letters", sajdah: false },
  { id: 37, name: "As-Saffat", nameArabic: "الصافات", verses: 182, type: "Makkan", length: "Long", juz: 23, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 38, name: "Sad", nameArabic: "ص", verses: 88, type: "Makkan", length: "Medium", juz: 23, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 39, name: "Az-Zumar", nameArabic: "الزمر", verses: 75, type: "Makkan", length: "Medium", juz: 23, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 40, name: "Ghafir", nameArabic: "غافر", verses: 85, type: "Makkan", length: "Medium", juz: 24, themes: ["Tawheed", "Stories"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 41, name: "Fussilat", nameArabic: "فصلت", verses: 54, type: "Makkan", length: "Medium", juz: 24, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: true },
  { id: 42, name: "Ash-Shuraa", nameArabic: "الشورى", verses: 53, type: "Makkan", length: "Medium", juz: 25, themes: ["Tawheed", "Commands"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 43, name: "Az-Zukhruf", nameArabic: "الزخرف", verses: 89, type: "Makkan", length: "Medium", juz: 25, themes: ["Tawheed", "Stories"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 44, name: "Ad-Dukhan", nameArabic: "الدخان", verses: 59, type: "Makkan", length: "Short", juz: 25, themes: ["Qiyamah", "Stories"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 45, name: "Al-Jathiyah", nameArabic: "الجاثية", verses: 37, type: "Makkan", length: "Short", juz: 25, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 46, name: "Al-Ahqaf", nameArabic: "الأحقاف", verses: 35, type: "Makkan", length: "Short", juz: 26, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 47, name: "Muhammad", nameArabic: "محمد", verses: 38, type: "Medinan", length: "Short", juz: 26, themes: ["Commands", "Laws"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 48, name: "Al-Fath", nameArabic: "الفتح", verses: 29, type: "Medinan", length: "Short", juz: 26, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 49, name: "Al-Hujurat", nameArabic: "الحجرات", verses: 18, type: "Medinan", length: "Short", juz: 26, themes: ["Commands", "Laws"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 50, name: "Qaf", nameArabic: "ق", verses: 45, type: "Makkan", length: "Short", juz: 26, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Letters", sajdah: false },
  { id: 51, name: "Adh-Dhariyat", nameArabic: "الذاريات", verses: 60, type: "Makkan", length: "Medium", juz: 26, themes: ["Tawheed", "Stories"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 52, name: "At-Tur", nameArabic: "الطور", verses: 49, type: "Makkan", length: "Short", juz: 27, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: true },
  { id: 53, name: "An-Najm", nameArabic: "النجم", verses: 62, type: "Makkan", length: "Medium", juz: 27, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: true },
  { id: 54, name: "Al-Qamar", nameArabic: "القمر", verses: 55, type: "Makkan", length: "Medium", juz: 27, themes: ["Stories", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 55, name: "Ar-Rahman", nameArabic: "الرحمن", verses: 78, type: "Medinan", length: "Medium", juz: 27, themes: ["Tawheed", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 56, name: "Al-Waqi'ah", nameArabic: "الواقعة", verses: 96, type: "Makkan", length: "Medium", juz: 27, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 57, name: "Al-Hadid", nameArabic: "الحديد", verses: 29, type: "Medinan", length: "Short", juz: 27, themes: ["Tawheed", "Commands"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 58, name: "Al-Mujadila", nameArabic: "المجادلة", verses: 22, type: "Medinan", length: "Short", juz: 28, themes: ["Laws", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 59, name: "Al-Hashr", nameArabic: "الحشر", verses: 24, type: "Medinan", length: "Short", juz: 28, themes: ["Commands", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 60, name: "Al-Mumtahanah", nameArabic: "الممتحنة", verses: 13, type: "Medinan", length: "Short", juz: 28, themes: ["Laws", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 61, name: "As-Saff", nameArabic: "الصف", verses: 14, type: "Medinan", length: "Short", juz: 28, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 62, name: "Al-Jumu'ah", nameArabic: "الجمعة", verses: 11, type: "Medinan", length: "Short", juz: 28, themes: ["Worship", "Commands"], usage: ["Friday"], openingStyle: "Praise", sajdah: false },
  { id: 63, name: "Al-Munafiqun", nameArabic: "المنافقون", verses: 11, type: "Medinan", length: "Short", juz: 28, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 64, name: "At-Taghabun", nameArabic: "التغابن", verses: 18, type: "Medinan", length: "Short", juz: 28, themes: ["Commands", "Qiyamah"], usage: ["Daily"], openingStyle: "Praise", sajdah: false },
  { id: 65, name: "At-Talaq", nameArabic: "الطلاق", verses: 12, type: "Medinan", length: "Short", juz: 28, themes: ["Laws", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 66, name: "At-Tahrim", nameArabic: "التحريم", verses: 12, type: "Medinan", length: "Short", juz: 28, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 67, name: "Al-Mulk", nameArabic: "الملك", verses: 30, type: "Makkan", length: "Short", juz: 29, themes: ["Tawheed", "Qiyamah"], usage: ["Before Sleep", "Protection"], openingStyle: "Praise", sajdah: false },
  { id: 68, name: "Al-Qalam", nameArabic: "القلم", verses: 52, type: "Makkan", length: "Medium", juz: 29, themes: ["Stories", "Commands"], usage: ["Daily"], openingStyle: "Oaths", sajdah: true },
  { id: 69, name: "Al-Haqqah", nameArabic: "الحاقة", verses: 52, type: "Makkan", length: "Medium", juz: 29, themes: ["Qiyamah", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 70, name: "Al-Ma'arij", nameArabic: "المعارج", verses: 44, type: "Makkan", length: "Short", juz: 29, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 71, name: "Nuh", nameArabic: "نوح", verses: 28, type: "Makkan", length: "Short", juz: 29, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 72, name: "Al-Jinn", nameArabic: "الجن", verses: 28, type: "Makkan", length: "Short", juz: 29, themes: ["Stories", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 73, name: "Al-Muzzammil", nameArabic: "المزمل", verses: 20, type: "Makkan", length: "Short", juz: 29, themes: ["Worship", "Commands"], usage: ["Night"], openingStyle: "Commands", sajdah: false },
  { id: 74, name: "Al-Muddaththir", nameArabic: "المدثر", verses: 56, type: "Makkan", length: "Medium", juz: 29, themes: ["Commands", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 75, name: "Al-Qiyamah", nameArabic: "القيامة", verses: 40, type: "Makkan", length: "Short", juz: 29, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 76, name: "Al-Insan", nameArabic: "الإنسان", verses: 31, type: "Medinan", length: "Short", juz: 29, themes: ["Qiyamah", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: true },
  { id: 77, name: "Al-Mursalat", nameArabic: "المرسلات", verses: 50, type: "Makkan", length: "Short", juz: 29, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 78, name: "An-Naba", nameArabic: "النبأ", verses: 40, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 79, name: "An-Nazi'at", nameArabic: "النازعات", verses: 46, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Stories"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 80, name: "Abasa", nameArabic: "عبس", verses: 42, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 81, name: "At-Takwir", nameArabic: "التكوير", verses: 29, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Oaths"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 82, name: "Al-Infitar", nameArabic: "الإنفطار", verses: 19, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 83, name: "Al-Mutaffifin", nameArabic: "المطففين", verses: 36, type: "Makkan", length: "Short", juz: 30, themes: ["Commands", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 84, name: "Al-Inshiqaq", nameArabic: "الإنشقاق", verses: 25, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: true },
  { id: 85, name: "Al-Buruj", nameArabic: "البروج", verses: 22, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Qiyamah"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 86, name: "At-Tariq", nameArabic: "الطارق", verses: 17, type: "Makkan", length: "Short", juz: 30, themes: ["Tawheed", "Oaths"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 87, name: "Al-A'la", nameArabic: "الأعلى", verses: 19, type: "Makkan", length: "Short", juz: 30, themes: ["Tawheed", "Praise"], usage: ["Daily"], openingStyle: "Praise", sajdah: true },
  { id: 88, name: "Al-Ghashiyah", nameArabic: "الغاشية", verses: 26, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 89, name: "Al-Fajr", nameArabic: "الفجر", verses: 30, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Qiyamah"], usage: ["Morning"], openingStyle: "Oaths", sajdah: false },
  { id: 90, name: "Al-Balad", nameArabic: "البلد", verses: 20, type: "Makkan", length: "Short", juz: 30, themes: ["Commands", "Lessons"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 91, name: "Ash-Shams", nameArabic: "الشمس", verses: 15, type: "Makkan", length: "Short", juz: 30, themes: ["Tawheed", "Lessons"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 92, name: "Al-Layl", nameArabic: "الليل", verses: 21, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Qiyamah"], usage: ["Night"], openingStyle: "Oaths", sajdah: false },
  { id: 93, name: "Ad-Duhaa", nameArabic: "الضحى", verses: 11, type: "Makkan", length: "Short", juz: 30, themes: ["Comfort", "Stories"], usage: ["Morning"], openingStyle: "Oaths", sajdah: false },
  { id: 94, name: "Ash-Sharh", nameArabic: "الشرح", verses: 8, type: "Makkan", length: "Short", juz: 30, themes: ["Comfort", "Encouragement"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 95, name: "At-Tin", nameArabic: "التين", verses: 8, type: "Makkan", length: "Short", juz: 30, themes: ["Tawheed", "Lessons"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 96, name: "Al-Alaq", nameArabic: "العلق", verses: 19, type: "Makkan", length: "Short", juz: 30, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: true },
  { id: 97, name: "Al-Qadr", nameArabic: "القدر", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Worship", "Ramadan"], usage: ["Ramadan", "Night"], openingStyle: "Commands", sajdah: false },
  { id: 98, name: "Al-Bayyinah", nameArabic: "البينة", verses: 8, type: "Medinan", length: "Short", juz: 30, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", verses: 8, type: "Medinan", length: "Short", juz: 30, themes: ["Qiyamah", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 100, name: "Al-Adiyat", nameArabic: "العاديات", verses: 11, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Qiyamah"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 101, name: "Al-Qari'ah", nameArabic: "القارعة", verses: 11, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Tawheed"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 102, name: "At-Takathur", nameArabic: "التكاثر", verses: 8, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 103, name: "Al-Asr", nameArabic: "العصر", verses: 3, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Time"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 104, name: "Al-Humazah", nameArabic: "الهمزة", verses: 9, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 105, name: "Al-Fil", nameArabic: "الفيل", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 106, name: "Quraysh", nameArabic: "قريش", verses: 4, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Gratitude"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 107, name: "Al-Ma'un", nameArabic: "الماعون", verses: 7, type: "Makkan", length: "Short", juz: 30, themes: ["Commands", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 108, name: "Al-Kawthar", nameArabic: "الكوثر", verses: 3, type: "Makkan", length: "Short", juz: 30, themes: ["Comfort", "Worship"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 109, name: "Al-Kafirun", nameArabic: "الكافرون", verses: 6, type: "Makkan", length: "Short", juz: 30, themes: ["Tawheed", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 110, name: "An-Nasr", nameArabic: "النصر", verses: 3, type: "Medinan", length: "Short", juz: 30, themes: ["Victory", "Gratitude"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 111, name: "Al-Masad", nameArabic: "المسد", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", verses: 4, type: "Makkan", length: "Short", juz: 30, themes: ["Tawheed", "Worship"], usage: ["Daily", "Protection"], openingStyle: "Commands", sajdah: false },
  { id: 113, name: "Al-Falaq", nameArabic: "الفلق", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Protection", "Duas"], usage: ["Protection", "Before Sleep"], openingStyle: "Commands", sajdah: false },
  { id: 114, name: "An-Nas", nameArabic: "الناس", verses: 6, type: "Makkan", length: "Short", juz: 30, themes: ["Protection", "Duas"], usage: ["Protection", "Before Sleep"], openingStyle: "Commands", sajdah: false },
];

// Mock tracks data
const mockTracks = [
  { id: 1, title: "Introduction & Verses 1-7", verseRange: "1-7", duration: "45:30", audioUrl: "#", pdfUrl: "#" },
  { id: 2, title: "The Opening Prayer", verseRange: "1-7", duration: "32:15", audioUrl: "#", pdfUrl: "#" },
];

const backgroundImages = [
  { id: 1, url: "/lovable-uploads/de544066-404e-4f0a-b317-094a97053dd8.png", name: "Interior View 1" },
  { id: 2, url: "/lovable-uploads/6aff7365-23e1-4926-ad1b-c21e2ecbd69d.png", name: "Interior View 2" },
  { id: 3, url: "/lovable-uploads/7c6c8e8e-cd8f-4ec8-ad1b-7fb29338ec2a.png", name: "Mosque Exterior" },
  { id: 4, url: "/lovable-uploads/007566fa-5c53-4160-8d81-59971d899649.png", name: "Audio Books" },
  { id: 5, url: "/lovable-uploads/45dc7a85-45be-402f-b230-9cf0edae2e9d.png", name: "Starry Night" },
  { id: 6, url: "/lovable-uploads/cef81c6f-a31f-4227-93ac-8a9b75817ad2.png", name: "Clock Study" },
];

const Index = () => {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [activeTab, setActiveTab] = useState("surahs");
  const [currentBg, setCurrentBg] = useState(backgroundImages[0].url);
  const [bgOpacity, setBgOpacity] = useState([100]);
  const [bgSharpness, setBgSharpness] = useState([0]);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [showControls, setShowControls] = useState(false);
  
  // Block Settings
  const [blockDarkness, setBlockDarkness] = useState([30]);
  const [borderThickness, setBorderThickness] = useState([2]);
  const [borderOpacity, setBorderOpacity] = useState([50]);
  const [numberBgColor, setNumberBgColor] = useState("#4C4B48");
  
  // Counter Animation
  const [surahCount, setSurahCount] = useState(0);
  const [audioCount, setAudioCount] = useState(0);
  const [hoursCount, setHoursCount] = useState(0);
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const counterRef = useRef(null);
  
  // Counter view state
  const [counterView, setCounterView] = useState("blocks");
  
  // Main view state (replaces surahs view)
  const [mainView, setMainView] = useState("surahs");
  
  // Track expansion states for surah toggle
  const [expandedSurahs, setExpandedSurahs] = useState(new Set());
  
  // Current playing track info for bottom player
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  
  // Favorites tracking
  const [favoriteTrackIds, setFavoriteTrackIds] = useState(new Set());
  
  // Completed tracks tracking
  const [completedTrackIds, setCompletedTrackIds] = useState(new Set());
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLength, setSelectedLength] = useState("all");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedUsage, setSelectedUsage] = useState("all");
  const [showSajdah, setShowSajdah] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const toggleFavorite = (trackId) => {
    const newFavorites = new Set(favoriteTrackIds);
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
      toast({ description: "Removed from favourites" });
    } else {
      newFavorites.add(trackId);
      toast({ description: "Added to favourites" });
    }
    setFavoriteTrackIds(newFavorites);
  };

  const handleSurahClick = (surah) => {
    const surahId = surah.id;
    if (expandedSurahs.has(surahId)) {
      const newExpanded = new Set(expandedSurahs);
      newExpanded.delete(surahId);
      setExpandedSurahs(newExpanded);
    } else {
      const newExpanded = new Set(expandedSurahs);
      newExpanded.add(surahId);
      setExpandedSurahs(newExpanded);
    }
  };

  const handleTrackPlay = (track, surah) => {
    setCurrentTrack({
      ...track,
      surahName: surah.name,
      surahArabic: surah.nameArabic
    });
    setPlayingTrack(track.id);
    setIsPlayerVisible(true);
    
    // Add to completed tracks
    setCompletedTrackIds(prev => new Set([...prev, track.id]));
  };

  const handlePlayPause = (trackId) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const handleShare = (track) => {
    const shareUrl = `${window.location.origin}/track/${track.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Track link copied to clipboard",
    });
  };

  const handleDownload = (track) => {
    toast({
      title: "Download Started",
      description: `Downloading ${track.title}`,
    });
  };

  const getBadgeColor = (type) => {
    return type === "Makkan" ? "bg-[#60543D]" : "bg-[#3B4D3A]";
  };

  const getBorderColor = (type, isSelected) => {
    if (isSelected) return "border-blue-400";
    const baseColor = type === "Makkan" ? "#A68C6B" : "#7A9678";
    return `border-[${baseColor}]`;
  };

  const getTrackBorderColor = (type) => {
    const baseColor = type === "Makkan" ? "#A68C6B" : "#7A9678";
    return `border-[${baseColor}]`;
  };

  // Filter function
  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch = surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surah.nameArabic.includes(searchTerm) ||
                         surah.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || surah.type === selectedType;
    const matchesLength = selectedLength === "all" || surah.length === selectedLength;
    const matchesThemes = selectedThemes.length === 0 || selectedThemes.some(theme => surah.themes.includes(theme));
    const matchesUsage = selectedUsage === "all" || surah.usage.includes(selectedUsage);
    const matchesSajdah = showSajdah === "all" || (showSajdah === "yes" && surah.sajdah) || (showSajdah === "no" && !surah.sajdah);
    
    return matchesSearch && matchesType && matchesLength && matchesThemes && matchesUsage && matchesSajdah;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedLength("all");
    setSelectedThemes([]);
    setSelectedUsage("all");
    setShowSajdah("all");
  };

  const activeFiltersCount = [
    searchTerm !== "",
    selectedType !== "all",
    selectedLength !== "all",
    selectedThemes.length > 0,
    selectedUsage !== "all",
    showSajdah !== "all"
  ].filter(Boolean).length;

  // Counter animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isCounterVisible) {
          setIsCounterVisible(true);
          
          // Animate Surahs counter
          let start = 0;
          const end = 114;
          const duration = 2000;
          const increment = end / (duration / 16);
          
          const surahTimer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setSurahCount(end);
              clearInterval(surahTimer);
            } else {
              setSurahCount(Math.floor(start));
            }
          }, 16);
          
          // Animate Audios counter
          let audioStart = 0;
          const audioEnd = 1097;
          const audioIncrement = audioEnd / (duration / 16);
          
          const audioTimer = setInterval(() => {
            audioStart += audioIncrement;
            if (audioStart >= audioEnd) {
              setAudioCount(audioEnd);
              clearInterval(audioTimer);
            } else {
              setAudioCount(Math.floor(audioStart));
            }
          }, 16);
          
          // Animate Hours counter
          let hoursStart = 0;
          const hoursEnd = 2157;
          const hoursIncrement = hoursEnd / (duration / 16);
          
          const hoursTimer = setInterval(() => {
            hoursStart += hoursIncrement;
            if (hoursStart >= hoursEnd) {
              setHoursCount(hoursEnd);
              clearInterval(hoursTimer);
            } else {
              setHoursCount(Math.floor(hoursStart));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => observer.disconnect();
  }, [isCounterVisible]);

  // Audio wave animation component
  const AudioWave = ({ isPlaying }) => (
    <div className="flex items-center space-x-0.5 h-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-white/70 rounded-full transition-all duration-300 ${
            isPlaying 
              ? `animate-pulse h-${Math.floor(Math.random() * 3) + 2}` 
              : 'h-2'
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isPlaying ? `${Math.random() * 16 + 8}px` : '8px'
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden font-poppins">
      {/* Dynamic Background - crisp and clear by default */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentBg})`,
          filter: `blur(${bgSharpness[0]}px)`,
          imageRendering: 'crisp-edges' as any
        }}
      />
      {/* Background overlay - only show when opacity is less than 100% */}
      {bgOpacity[0] < 100 && (
        <div 
          className="fixed inset-0 transition-all duration-1000"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${(100 - bgOpacity[0]) / 100})`,
          }}
        />
      )}
      
      {/* Header */}
      <header className="relative z-10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/3a5ddd31-2ae0-4452-90cd-ac556aad2bad.png" 
              alt="ARKolia Logo" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold text-white font-poppins">ARKOLIA.CO.ZA</h1>
              <p className="text-white/80 text-xs font-poppins">Daily Tafseer Collection</p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/10 backdrop-blur-md"
                onClick={() => setShowControls(true)}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/20 backdrop-blur-xl border-white/20 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white font-poppins">App Settings</DialogTitle>
                <DialogDescription className="text-white/70 font-poppins">
                  Customize your background and display preferences
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="background" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20">
                  <TabsTrigger value="background" className="data-[state=active]:bg-white/30 text-white font-poppins">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Background
                  </TabsTrigger>
                  <TabsTrigger value="blocks" className="data-[state=active]:bg-white/30 text-white font-poppins">
                    <Palette className="w-4 h-4 mr-2" />
                    Block Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="background" className="space-y-4">
                  {/* Background Images Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {backgroundImages.map((img) => (
                      <div 
                        key={img.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          currentBg === img.url ? 'border-[#0D3029] shadow-lg' : 'border-white/20'
                        }`}
                        onClick={() => setCurrentBg(img.url)}
                      >
                        <img 
                          src={img.url} 
                          alt={img.name}
                          className="w-full h-16 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                   {/* Opacity Slider */}
                   <div>
                     <label className="text-sm font-medium text-white mb-2 block font-poppins">
                       Background Opacity: {bgOpacity[0]}% 
                       <span className="text-white/60 text-xs ml-2">
                         (100% = original image)
                       </span>
                     </label>
                     <Slider
                       value={bgOpacity}
                       onValueChange={setBgOpacity}
                       max={100}
                       min={0}
                       step={5}
                       className="w-full"
                     />
                   </div>
                   
                   {/* Blur Slider */}
                   <div>
                     <label className="text-sm font-medium text-white mb-2 block font-poppins">
                       Background Blur: {bgSharpness[0]}px
                       <span className="text-white/60 text-xs ml-2">
                         (0px = crisp original)
                       </span>
                     </label>
                     <Slider
                       value={bgSharpness}
                       onValueChange={setBgSharpness}
                       max={10}
                       min={0}
                       step={0.5}
                       className="w-full"
                     />
                   </div>
                </TabsContent>
                
                <TabsContent value="blocks" className="space-y-4">
                  {/* Block Darkness */}
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block font-poppins">
                      Block Darkness: {blockDarkness[0]}%
                    </label>
                    <Slider
                      value={blockDarkness}
                      onValueChange={setBlockDarkness}
                      max={80}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Border Thickness */}
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block font-poppins">
                      Border Thickness: {borderThickness[0]}px
                    </label>
                    <Slider
                      value={borderThickness}
                      onValueChange={setBorderThickness}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Border Opacity */}
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block font-poppins">
                      Border Opacity: {borderOpacity[0]}%
                    </label>
                    <Slider
                      value={borderOpacity}
                      onValueChange={setBorderOpacity}
                      max={100}
                      min={20}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Number Circle Color */}
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block font-poppins">
                      Number Circle Color
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {["#4C4B48", "#60543D", "#3B4D3A", "#4B4155", "#2C3E50", "#8B4513", "#0D3029", "#2C5530", "#A68C6B", "#7A9678", "#8B6914", "#4A90A4"].map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            numberBgColor === color ? 'border-white scale-110' : 'border-white/30'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNumberBgColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="relative z-10 px-4 mb-6">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/40 backdrop-blur-xl border-3 border-[#0D3029]" 
                style={{ 
                  borderWidth: '3px',
                  backgroundColor: `rgba(255, 255, 255, ${blockDarkness[0] / 100})`
                }}>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/lovable-uploads/3a5ddd31-2ae0-4452-90cd-ac556aad2bad.png" 
                  alt="ARKolia Logo" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <h2 className="text-2xl font-bold text-[#0D3029] font-poppins">WELCOME TO ARKOLIA.CO.ZA</h2>
              </div>
              <p className="text-[#2C5530] leading-relaxed max-w-3xl mx-auto font-poppins font-medium">
                Listen to the daily Tafseer recordings by Moulana Abdur Rahman Kolia, delivered each morning after Fajr Salaah. Select any Surah below to access the available Tafseer tracks.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Filter Section */}
          <div className="bg-black/50 backdrop-blur-xl border-white/20 rounded-lg p-4 mb-6">
            <div className="flex flex-row gap-3 items-center">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D3029] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Surahs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/25 border border-white/30 rounded-lg text-[#0D3029] placeholder-[#0D3029]/60 focus:outline-none focus:ring-2 focus:ring-[#0D3029] font-poppins font-bold"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-green-300 text-[#0D3029] hover:bg-green-400 hover:text-[#0D3029] relative font-poppins shrink-0"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-[#0D3029] text-white text-xs px-2 py-0.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#0D3029]/70 hover:text-[#0D3029] hover:bg-[#0D3029]/10 font-poppins shrink-0"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="text-[#0D3029]/90 text-sm mb-2 block font-poppins font-medium">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-white/25 border-white/30 text-[#0D3029] font-poppins focus:ring-[#0D3029]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 backdrop-blur-xl">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Makkan" className="focus:bg-[#0D3029] focus:text-white">Makkan</SelectItem>
                        <SelectItem value="Medinan" className="focus:bg-[#0D3029] focus:text-white">Medinan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Length Filter */}
                  <div>
                    <label className="text-[#0D3029]/90 text-sm mb-2 block font-poppins font-medium">Length</label>
                    <Select value={selectedLength} onValueChange={setSelectedLength}>
                      <SelectTrigger className="bg-white/25 border-white/30 text-[#0D3029] font-poppins focus:ring-[#0D3029]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 backdrop-blur-xl">
                        <SelectItem value="all">All Lengths</SelectItem>
                        <SelectItem value="Short" className="focus:bg-[#0D3029] focus:text-white">Short</SelectItem>
                        <SelectItem value="Medium" className="focus:bg-[#0D3029] focus:text-white">Medium</SelectItem>
                        <SelectItem value="Long" className="focus:bg-[#0D3029] focus:text-white">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Usage Filter */}
                  <div>
                    <label className="text-[#0D3029]/90 text-sm mb-2 block font-poppins font-medium">Usage</label>
                    <Select value={selectedUsage} onValueChange={setSelectedUsage}>
                      <SelectTrigger className="bg-white/25 border-white/30 text-[#0D3029] font-poppins focus:ring-[#0D3029]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 backdrop-blur-xl">
                        <SelectItem value="all">All Usage</SelectItem>
                        <SelectItem value="Daily" className="focus:bg-[#0D3029] focus:text-white">Daily</SelectItem>
                        <SelectItem value="Friday" className="focus:bg-[#0D3029] focus:text-white">Friday</SelectItem>
                        <SelectItem value="Before Sleep" className="focus:bg-[#0D3029] focus:text-white">Before Sleep</SelectItem>
                        <SelectItem value="Protection" className="focus:bg-[#0D3029] focus:text-white">Protection</SelectItem>
                        <SelectItem value="Night" className="focus:bg-[#0D3029] focus:text-white">Night</SelectItem>
                        <SelectItem value="Morning" className="focus:bg-[#0D3029] focus:text-white">Morning</SelectItem>
                        <SelectItem value="Ramadan" className="focus:bg-[#0D3029] focus:text-white">Ramadan</SelectItem>
                        <SelectItem value="Hajj" className="focus:bg-[#0D3029] focus:text-white">Hajj</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sajdah Filter */}
                  <div>
                    <label className="text-[#0D3029]/90 text-sm mb-2 block font-poppins font-medium">Sajdah</label>
                    <Select value={showSajdah} onValueChange={setShowSajdah}>
                      <SelectTrigger className="bg-white/25 border-white/30 text-[#0D3029] font-poppins focus:ring-[#0D3029]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 backdrop-blur-xl">
                        <SelectItem value="all">All Surahs</SelectItem>
                        <SelectItem value="yes" className="focus:bg-[#0D3029] focus:text-white">With Sajdah</SelectItem>
                        <SelectItem value="no" className="focus:bg-[#0D3029] focus:text-white">Without Sajdah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Themes Filter */}
                  <div className="md:col-span-2">
                    <label className="text-[#0D3029]/90 text-sm mb-2 block font-poppins font-medium">Themes</label>
                    <ToggleGroup 
                      type="multiple" 
                      value={selectedThemes} 
                      onValueChange={setSelectedThemes}
                      className="flex flex-wrap gap-2 justify-start"
                    >
                      {["Tawheed", "Stories", "Laws", "Commands", "Worship", "Qiyamah", "Duas", "Lessons", "Protection"].map(theme => (
                        <ToggleGroupItem 
                          key={theme} 
                          value={theme}
                          className="bg-white/25 text-[#0D3029] border-white/30 hover:bg-[#0D3029] hover:text-white data-[state=on]:bg-[#0D3029] data-[state=on]:text-white text-xs px-3 py-1 font-poppins"
                        >
                          {theme}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main View Switch */}
          <div className="flex justify-center mb-6">
            <div className="bg-black/30 backdrop-blur-xl rounded-xl p-1 border border-white/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                <button
                  onClick={() => setMainView("recent")}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                    mainView === "recent"
                      ? "bg-white/25 text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setMainView("surahs")}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                    mainView === "surahs"
                      ? "bg-white/25 text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Surahs
                </button>
                <button
                  onClick={() => setMainView("favourites")}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                    mainView === "favourites"
                      ? "bg-white/25 text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Favourites
                </button>
                <button
                  onClick={() => setMainView("completed")}
                  className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                    mainView === "completed"
                      ? "bg-white/25 text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Based on View */}
          {mainView === "surahs" && (
            <div className="space-y-3">
              {filteredSurahs.map((surah) => {
                const isExpanded = expandedSurahs.has(surah.id);
                const isMakkan = surah.type === "Makkan";
                
                return (
                  <div key={surah.id}>
                    {/* Surah Card */}
                    <Card 
                      className="backdrop-blur-xl border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      style={{ 
                        background: `linear-gradient(135deg, ${isMakkan 
                          ? 'rgba(245, 245, 220, 0.15)' 
                          : 'rgba(232, 245, 232, 0.15)'} 0%, rgba(255, 255, 255, 0.05) 100%)`,
                        borderColor: isMakkan ? "#D4C4A8" : "#B8D4B8",
                        borderWidth: "1px",
                        borderStyle: 'solid',
                        backdropFilter: "blur(15px)"
                      }}
                    >
                      <CardContent className="p-4" onClick={() => handleSurahClick(surah)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                              style={{ backgroundColor: numberBgColor }}
                            >
                              <span className="text-white font-bold text-sm font-poppins">{surah.id}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg text-white font-poppins drop-shadow-lg">{surah.name}</h3>
                                <Badge className={`${getBadgeColor(surah.type)} text-white text-xs px-2 py-1 font-poppins font-medium hover:opacity-80 transition-opacity`}>
                                  {surah.type}
                                </Badge>
                              </div>
                              <p className="text-xl font-arabic text-white/90 mb-2 drop-shadow-lg">{surah.nameArabic}</p>
                              <div className="flex items-center space-x-4 text-sm text-white/80 font-poppins font-medium">
                                <span>{surah.verses} verses</span>
                                {surah.sajdah && (
                                  <Badge className="bg-[#4B4155] hover:bg-[#4B4155]/80 text-white text-xs px-2 py-0.5 font-poppins transition-colors">
                                    Sajdah
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white/60 font-poppins text-sm">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Expanded Tracks */}
                    {isExpanded && (
                      <div className="ml-2 md:ml-4 mt-3 space-y-3">
                        {mockTracks.map((track) => (
                          <Card 
                            key={track.id} 
                            className="backdrop-blur-xl border-white/30 hover:bg-white/20 transition-all duration-300"
                            style={{ 
                              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)`,
                              borderWidth: "1px",
                              borderStyle: 'solid',
                              backdropFilter: "blur(20px)"
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-white font-poppins text-sm md:text-base mb-1 leading-tight">
                                    {track.title}
                                  </h4>
                                  <p className="text-white/80 text-xs md:text-sm font-poppins">
                                    Verses {track.verseRange} • {track.duration}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2">
                                  <div className="flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className={`w-8 h-8 p-0 transition-colors ${
                                        favoriteTrackIds.has(track.id)
                                          ? "text-red-400 hover:text-red-300"
                                          : "text-white/70 hover:text-red-400"
                                      } hover:bg-white/10`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(track.id);
                                      }}
                                    >
                                      <Heart className="w-3 h-3" fill={favoriteTrackIds.has(track.id) ? "currentColor" : "none"} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toast({ description: "Sharing..." });
                                      }}
                                    >
                                      <Share2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toast({ description: "Downloading..." });
                                      }}
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toast({ description: "Opening PDF..." });
                                      }}
                                    >
                                      <FileText className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="bg-[#0D3029] hover:bg-[#0D3029]/80 text-white px-3 py-1"
                                      onClick={() => handleTrackPlay(track, surah)}
                                    >
                                      {playingTrack === track.id ? (
                                        <Pause className="w-3 h-3" />
                                      ) : (
                                        <Play className="w-3 h-3" />
                                      )}
                                    </Button>
                                    <AudioWave isPlaying={playingTrack === track.id} />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* No Results Message */}
              {filteredSurahs.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-white/60 mb-4">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-poppins">No Surahs found matching your criteria</p>
                    <p className="text-sm font-poppins">Try adjusting your filters or search terms</p>
                  </div>
                  <Button 
                    onClick={clearFilters}
                    className="bg-[#0D3029] hover:bg-[#0D3029]/80 text-white font-poppins"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Recent View */}
          {mainView === "recent" && (
            <div className="space-y-4">
              {/* Sample Recent Tracks */}
              {[
                {
                  id: "recent-1",
                  title: "Fri-20250728 - Surah Kahf, Verses 1–5",
                  surahName: "Al-Kahf",
                  duration: "12:45",
                  date: "28 July 2025",
                  verseRange: "1-5"
                },
                {
                  id: "recent-2", 
                  title: "Thu-20250727 - Surah Al-Baqarah, Verses 255–260",
                  surahName: "Al-Baqarah",
                  duration: "15:20",
                  date: "27 July 2025",
                  verseRange: "255-260"
                },
                {
                  id: "recent-3",
                  title: "Wed-20250726 - Surah Yasin, Verses 1–12",
                  surahName: "Ya-Sin",
                  duration: "9:30",
                  date: "26 July 2025",
                  verseRange: "1-12"
                }
                ].map((track) => (
                  <Card 
                    key={track.id} 
                    className="backdrop-blur-xl hover:bg-black/60 transition-all duration-300 shadow-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.40) 100%)`,
                      borderWidth: "2px",
                      borderStyle: 'solid',
                      borderColor: "white",
                      backdropFilter: "blur(20px)"
                    }}
                  >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white font-poppins text-sm md:text-base mb-1 leading-tight">
                          {track.title.split(' - ')[0]}
                        </h4>
                        <p className="text-white/80 text-xs md:text-sm font-poppins">
                          {track.title.split(' - ')[1]}
                        </p>
                        <p className="text-white/60 text-xs font-poppins mt-1">{track.date}</p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`w-8 h-8 p-0 transition-colors ${
                              favoriteTrackIds.has(track.id)
                                ? "text-red-400 hover:text-red-300"
                                : "text-white/70 hover:text-red-400"
                            } hover:bg-white/10`}
                            onClick={() => toggleFavorite(track.id)}
                          >
                            <Heart className="w-3 h-3" fill={favoriteTrackIds.has(track.id) ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => toast({ description: "Sharing..." })}
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => toast({ description: "Downloading..." })}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => toast({ description: "Opening PDF..." })}
                          >
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-[#0D3029] hover:bg-[#0D3029]/80 text-white px-3 py-1"
                          onClick={() => {
                            setCurrentTrack({
                              id: track.id,
                              title: track.title,
                              surahName: track.surahName,
                              duration: track.duration
                            });
                            setPlayingTrack(track.id);
                            setIsPlayerVisible(true);
                            // Add to completed tracks
                            setCompletedTrackIds(prev => new Set([...prev, track.id]));
                          }}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Favourites View */}
          {mainView === "favourites" && (
            <div className="space-y-4">
              {favoriteTrackIds.size === 0 ? (
                <div className="text-center py-12">
                  <div className="text-white/60 mb-4">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-poppins">No Favourite Tracks</p>
                    <p className="text-sm font-poppins">Add tracks to favourites to see them here</p>
                  </div>
                </div>
              ) : (
                // Show favorite tracks - for demo purposes, we'll show the recent tracks that are favorited
                Array.from(favoriteTrackIds).map((trackId: any) => (
                  <Card 
                    key={String(trackId)} 
                    className="backdrop-blur-xl border-white/30 hover:bg-white/15 transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.10) 100%)`,
                      borderWidth: "1px",
                      borderStyle: 'solid',
                      backdropFilter: "blur(20px)"
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white font-poppins text-sm md:text-base mb-1 leading-tight">
                            Favorite Track #{String(trackId)}
                          </h4>
                          <p className="text-white/80 text-xs md:text-sm font-poppins">
                            Sample favorite content
                          </p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-red-400 hover:text-red-300 hover:bg-white/10"
                              onClick={() => toggleFavorite(trackId)}
                            >
                              <Heart className="w-3 h-3" fill="currentColor" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Share2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <FileText className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-[#0D3029] hover:bg-[#0D3029]/80 text-white px-3 py-1"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Completed View */}
          {mainView === "completed" && (
            <div className="space-y-4">
              {completedTrackIds.size === 0 ? (
                <div className="text-center py-12">
                  <div className="text-white/60 mb-4">
                    <p className="text-lg font-poppins">Completed Tracks</p>
                    <p className="text-sm font-poppins">Tracks you've finished listening to will appear here</p>
                  </div>
                </div>
              ) : (
                // Show completed tracks from recent tracks and surah tracks
                [
                  {
                    id: "recent-1",
                    title: "Fri-20250728 - Surah Kahf, Verses 1–5",
                    surahName: "Al-Kahf",
                    duration: "12:45",
                    date: "28 July 2025",
                    verseRange: "1-5"
                  },
                  {
                    id: "recent-2", 
                    title: "Thu-20250727 - Surah Al-Baqarah, Verses 255–260",
                    surahName: "Al-Baqarah",
                    duration: "15:20",
                    date: "27 July 2025",
                    verseRange: "255-260"
                  }
                ].filter(track => completedTrackIds.has(track.id)).map((track) => (
                  <Card 
                    key={track.id} 
                    className="backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)`,
                      borderWidth: "1px",
                      borderStyle: 'solid',
                      backdropFilter: "blur(20px)"
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white font-poppins text-sm md:text-base mb-1 leading-tight">
                            {track.title.split(' - ')[0]}
                          </h4>
                          <p className="text-white/80 text-xs md:text-sm font-poppins">
                            {track.title.split(' - ')[1]}
                          </p>
                          <p className="text-white/60 text-xs font-poppins mt-1">{track.date}</p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`w-8 h-8 p-0 transition-colors ${
                                favoriteTrackIds.has(track.id)
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-white/70 hover:text-red-400"
                              } hover:bg-white/10`}
                              onClick={() => toggleFavorite(track.id)}
                            >
                              <Heart className="w-3 h-3" fill={favoriteTrackIds.has(track.id) ? "currentColor" : "none"} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => toast({ description: "Sharing..." })}
                            >
                              <Share2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => toast({ description: "Downloading..." })}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => toast({ description: "Opening PDF..." })}
                            >
                              <FileText className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-[#0D3029] hover:bg-[#0D3029]/80 text-white px-3 py-1"
                            onClick={() => {
                              setCurrentTrack({
                                id: track.id,
                                title: track.title,
                                surahName: track.surahName,
                                duration: track.duration
                              });
                              setPlayingTrack(track.id);
                              setIsPlayerVisible(true);
                            }}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

        </div>
      </main>

      {/* Counter Statistics Module */}
      <section ref={counterRef} className="relative z-10 px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          {/* Image View Only - Default */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Surahs - Image Style */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-[#3F533C] to-[#3F533C] rounded-2xl p-8 text-center shadow-2xl border-2 border-white backdrop-blur-xl">
                <div className="text-6xl font-bold text-white mb-2 font-poppins">
                  {surahCount.toLocaleString()}
                </div>
                <div className="text-white text-lg font-medium opacity-90">
                  Surahs
                </div>
                <div className="text-white/70 text-sm font-medium mt-1">
                  Complete Quran Collection
                </div>
              </div>
            </div>

            {/* Audios - Image Style */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-[#54465F] to-[#54465F] rounded-2xl p-8 text-center shadow-2xl border-2 border-white backdrop-blur-xl">
                <div className="text-6xl font-bold text-white mb-2 font-poppins">
                  {audioCount.toLocaleString()}
                </div>
                <div className="text-white text-lg font-medium opacity-90">
                  Audios
                </div>
                <div className="text-white/70 text-sm font-medium mt-1">
                  Tafseer Recordings
                </div>
              </div>
            </div>

            {/* Hours - Image Style */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-[#5C5D40] to-[#5C5D40] rounded-2xl p-8 text-center shadow-2xl border-2 border-white backdrop-blur-xl">
                <div className="text-6xl font-bold text-white mb-2 font-poppins">
                  {hoursCount.toLocaleString()}
                </div>
                <div className="text-white text-lg font-medium opacity-90">
                  Hours
                </div>
                <div className="text-white/70 text-sm font-medium mt-1">
                  Total Content Duration
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Audio Player */}
      {isPlayerVisible && currentTrack && (
        <div className="fixed bottom-16 left-0 right-0 z-30">
          <div className="max-w-6xl mx-auto px-4">
            <Card className="bg-[#0D3029]/95 backdrop-blur-xl border-[#0D3029]/50 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: numberBgColor }}
                    >
                      <span className="text-white font-bold text-sm font-poppins">
                        {currentTrack.id}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm font-poppins">{currentTrack.title}</h3>
                      <p className="text-white/80 text-xs font-poppins">
                        {currentTrack.surahName} • {currentTrack.duration}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <AudioWave isPlaying={playingTrack === currentTrack.id} />
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                      >
                        ⏮
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => handlePlayPause(currentTrack.id)}
                      >
                        {playingTrack === currentTrack.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/10"
                      >
                        ⏭
                      </Button>
                    </div>
                    
                    <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/70 transition-all duration-300"
                        style={{ width: playingTrack === currentTrack.id ? '30%' : '0%' }}
                      />
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPlayerVisible(false)}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/044670b3-5f8e-4be0-a4a4-dba6f69dbdc6.png" 
                alt="ARKolia Banner" 
                className="h-6 w-auto"
              />
            </div>
            <p className="text-white/70 text-xs text-center font-poppins">
              © 2025 – Simtech W for ARKOLIA.CO.ZA. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
