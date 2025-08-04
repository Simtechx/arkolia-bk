import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Download, Share2, FileText, Settings, Image as ImageIcon, Filter, Search, X, Palette, ChevronDown, ChevronRight, Heart, BookOpen, Headphones, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from '@/hooks/use-toast';
import { useRSSFeed } from '@/hooks/useRSSFeed';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

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
  { id: 90, name: "Al-Balad", nameArabic: "البلد", verses: 20, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 91, name: "Ash-Shams", nameArabic: "الشمس", verses: 15, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Oaths"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 92, name: "Al-Layl", nameArabic: "الليل", verses: 21, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Oaths"], usage: ["Night"], openingStyle: "Oaths", sajdah: false },
  { id: 93, name: "Ad-Duha", nameArabic: "الضحى", verses: 11, type: "Makkan", length: "Short", juz: 30, themes: ["Comfort", "Oaths"], usage: ["Morning"], openingStyle: "Oaths", sajdah: false },
  { id: 94, name: "Ash-Sharh", nameArabic: "الشرح", verses: 8, type: "Makkan", length: "Short", juz: 30, themes: ["Comfort", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 95, name: "At-Tin", nameArabic: "التين", verses: 8, type: "Makkan", length: "Short", juz: 30, themes: ["Oaths", "Tawheed"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 96, name: "Al-Alaq", nameArabic: "العلق", verses: 19, type: "Makkan", length: "Short", juz: 30, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: true },
  { id: 97, name: "Al-Qadr", nameArabic: "القدر", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Worship", "Duas"], usage: ["Ramadan"], openingStyle: "Commands", sajdah: false },
  { id: 98, name: "Al-Bayyinah", nameArabic: "البينة", verses: 8, type: "Medinan", length: "Short", juz: 30, themes: ["Commands", "Stories"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", verses: 8, type: "Medinan", length: "Short", juz: 30, themes: ["Qiyamah", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 100, name: "Al-Adiyat", nameArabic: "العاديات", verses: 11, type: "Makkan", length: "Short", juz: 30, themes: ["Oaths", "Lessons"], usage: ["Daily"], openingStyle: "Oaths", sajdah: false },
  { id: 101, name: "Al-Qari'ah", nameArabic: "القارعة", verses: 11, type: "Makkan", length: "Short", juz: 30, themes: ["Qiyamah", "Commands"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 102, name: "At-Takathur", nameArabic: "التكاثر", verses: 8, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 103, name: "Al-Asr", nameArabic: "العصر", verses: 3, type: "Makkan", length: "Short", juz: 30, themes: ["Oaths", "Lessons"], usage: ["Afternoon"], openingStyle: "Oaths", sajdah: false },
  { id: 104, name: "Al-Humazah", nameArabic: "الهمزة", verses: 9, type: "Makkan", length: "Short", juz: 30, themes: ["Lessons", "Qiyamah"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 105, name: "Al-Fil", nameArabic: "الفيل", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 106, name: "Quraysh", nameArabic: "قريش", verses: 4, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Worship"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 107, name: "Al-Ma'un", nameArabic: "الماعون", verses: 7, type: "Makkan", length: "Short", juz: 30, themes: ["Commands", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 108, name: "Al-Kawthar", nameArabic: "الكوثر", verses: 3, type: "Makkan", length: "Short", juz: 30, themes: ["Worship", "Praise"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 109, name: "Al-Kafirun", nameArabic: "الكافرون", verses: 6, type: "Makkan", length: "Short", juz: 30, themes: ["Commands", "Tawheed"], usage: ["Before Sleep", "Protection"], openingStyle: "Commands", sajdah: false },
  { id: 110, name: "An-Nasr", nameArabic: "النصر", verses: 3, type: "Medinan", length: "Short", juz: 30, themes: ["Commands", "Praise"], usage: ["Victory"], openingStyle: "Commands", sajdah: false },
  { id: 111, name: "Al-Masad", nameArabic: "المسد", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Stories", "Lessons"], usage: ["Daily"], openingStyle: "Commands", sajdah: false },
  { id: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", verses: 4, type: "Makkan", length: "Short", juz: 30, themes: ["Tawheed", "Worship"], usage: ["Daily", "Protection"], openingStyle: "Commands", sajdah: false },
  { id: 113, name: "Al-Falaq", nameArabic: "الفلق", verses: 5, type: "Makkan", length: "Short", juz: 30, themes: ["Protection", "Duas"], usage: ["Daily", "Protection"], openingStyle: "Commands", sajdah: false },
  { id: 114, name: "An-Nas", nameArabic: "الناس", verses: 6, type: "Makkan", length: "Short", juz: 30, themes: ["Protection", "Duas"], usage: ["Daily", "Protection"], openingStyle: "Commands", sajdah: false }
];

// Mock tracks data for demonstration
const mockTracks = [
  { id: 1, title: "Verses 1-5", verseRange: "1-5", duration: "3:25" },
  { id: 2, title: "Verses 6-12", verseRange: "6-12", duration: "4:12" },
  { id: 3, title: "Verses 13-18", verseRange: "13-18", duration: "2:58" },
];

// Background images
const backgroundImages = [
  { id: 1, name: "Madinah", url: "/lovable-uploads/044670b3-5f8e-4be0-a4a4-dba6f69dbdc6.png" },
  { id: 2, name: "Makkah", url: "/lovable-uploads/7c6c8e8e-cd8f-4ec8-ad1b-7fb29338ec2a.png" },
  { id: 3, name: "Kaaba", url: "/lovable-uploads/cef81c6f-a31f-4227-93ac-8a9b75817ad2.png" },
  { id: 4, name: "Desert", url: "/lovable-uploads/7c4f4c34-d840-49ba-8b37-be7770f72a79.png" },
  { id: 5, name: "Quran", url: "/lovable-uploads/45dc7a85-45be-402f-b230-9cf0edae2e9d.png" },
  { id: 6, name: "Islamic Pattern", url: "/lovable-uploads/3a5ddd31-2ae0-4452-90cd-ac556aad2bad.png" },
  { id: 7, name: "Mosque", url: "/lovable-uploads/6aff7365-23e1-4926-ad1b-c21e2ecbd69d.png" },
  { id: 8, name: "Islamic Calligraphy", url: "/lovable-uploads/de544066-404e-4f0a-b317-094a97053dd8.png" },
  { id: 9, name: "Stars", url: "/lovable-uploads/007566fa-5c53-4160-8d81-59971d899649.png" }
];

const Index = () => {
  // State management
  const [mainView, setMainView] = useState("recent");
  const [favoriteTrackIds, setFavoriteTrackIds] = useState(new Set());
  const [completedTrackIds, setCompletedTrackIds] = useState(new Set());
  const [expandedSurahs, setExpandedSurahs] = useState(new Set());
  const [showControls, setShowControls] = useState(false);
  const [currentBg, setCurrentBg] = useState(backgroundImages[0].url);
  const [bgOpacity, setBgOpacity] = useState([80]);
  const [bgSharpness, setBgSharpness] = useState([2]);
  const [blockDarkness, setBlockDarkness] = useState([50]);
  const [borderThickness, setBorderThickness] = useState([2]);
  const [borderOpacity, setBorderOpacity] = useState([70]);
  const [numberBgColor, setNumberBgColor] = useState("#4C4B48");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedUsage, setSelectedUsage] = useState("");
  const [showSajdah, setShowSajdah] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Counter animation states
  const [surahCount, setSurahCount] = useState(0);
  const [audioCount, setAudioCount] = useState(0);
  const [hoursCount, setHoursCount] = useState(0);
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const counterRef = useRef(null);

  // RSS Feed hook
  const { data: rssData, isLoading: isLoadingRSS, error: rssError } = useRSSFeed('https://feeds.captivate.fm/arkolia-tafseer/');
  
  // Audio player hook
  const { currentTrack: audioCurrentTrack, audioState, loadTrack, togglePlayPause, seek, formatTime } = useAudioPlayer();

  // Utility functions
  const toggleFavorite = (trackId) => {
    const newFavorites = new Set(favoriteTrackIds);
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
    } else {
      newFavorites.add(trackId);
    }
    setFavoriteTrackIds(newFavorites);
  };

  const handleSurahClick = (surah) => {
    const surahId = surah.id;
    if (expandedSurahs.has(surahId)) {
      setExpandedSurahs(prev => {
        const newExpanded = new Set(prev);
        newExpanded.delete(surahId);
        return newExpanded;
      });
    } else {
      setExpandedSurahs(prev => new Set(prev).add(surahId));
    }
  };

  const handleTrackPlay = (track: any, surah?: any) => {
    const trackToPlay = {
      ...track,
      surahName: surah?.name || track.surahName || 'Unknown Surah',
      audioUrl: track.audioUrl
    };
    
    setCurrentTrack(trackToPlay);
    setPlayingTrack(track.id);
    setIsPlaying(true);
    
    if (track.audioUrl) {
      loadTrack(trackToPlay);
    }
  };

  const handlePlayPause = (trackId) => {
    if (currentTrack?.id === trackId) {
      togglePlayPause();
    } else {
      const track = rssData?.find(t => t.id === trackId);
      if (track) {
        handleTrackPlay(track);
      }
    }
  };

  const handleShare = (track) => {
    navigator.clipboard.writeText(`Check out this Quran recitation: ${track.title}`);
    toast({
      title: "Link copied to clipboard",
      description: "Share this beautiful recitation with others",
      duration: 2000,
    });
  };

  const handleDownload = (track) => {
    toast({
      title: "Download started",
      description: `Downloading ${track.title}`,
      duration: 2000,
    });
  };

  const getBadgeColor = (type) => {
    return type === "Makkan" ? "bg-[#8B4513] hover:bg-[#8B4513]/80" : "bg-[#0D3029] hover:bg-[#0D3029]/80";
  };

  const getBorderColor = (type, isSelected) => {
    const baseColor = type === "Makkan" ? "rgba(139, 69, 19, 0.8)" : "rgba(13, 48, 41, 0.8)";
    return isSelected ? baseColor : "rgba(255, 255, 255, 0.3)";
  };

  const getTrackBorderColor = (type) => {
    return type === "Makkan" ? "rgba(139, 69, 19, 0.6)" : "rgba(13, 48, 41, 0.6)";
  };

  // Filtering logic
  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch = surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surah.nameArabic.includes(searchTerm);
    const matchesType = !selectedType || surah.type === selectedType;
    const matchesLength = !selectedLength || surah.length === selectedLength;
    const matchesUsage = !selectedUsage || surah.usage.includes(selectedUsage);
    const matchesSajdah = !showSajdah || surah.sajdah;
    const matchesThemes = selectedThemes.length === 0 || selectedThemes.some(theme => surah.themes.includes(theme));
    
    return matchesSearch && matchesType && matchesLength && matchesUsage && matchesSajdah && matchesThemes;
  });

  const clearFilters = () => {
    setSelectedType("");
    setSelectedLength("");
    setSelectedUsage("");
    setShowSajdah(false);
    setSelectedThemes([]);
    setSearchTerm("");
  };

  const activeFiltersCount = [
    selectedType,
    selectedLength,
    selectedUsage,
    showSajdah,
    searchTerm,
    selectedThemes.length > 0
  ].filter(Boolean).length;

  // Counter animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isCounterVisible) {
          setIsCounterVisible(true);
          
          // Animate Surah count
          const surahTimer = setInterval(() => {
            setSurahCount(start => {
              const end = 114;
              if (start >= end) {
                clearInterval(surahTimer);
                return end;
              } else {
                return start + 2;
              }
            });
          }, 30);
          
          // Animate audio count
          const audioTimer = setInterval(() => {
            setAudioCount(audioStart => {
              const audioEnd = 1200;
              if (audioStart >= audioEnd) {
                clearInterval(audioTimer);
                return audioEnd;
              } else {
                return audioStart + 20;
              }
            });
          }, 30);
          
          // Animate hours count
          const hoursTimer = setInterval(() => {
            setHoursCount(hoursStart => {
              const hoursEnd = 120;
              if (hoursStart >= hoursEnd) {
                clearInterval(hoursTimer);
                return hoursEnd;
              } else {
                return hoursStart + 2;
              }
            });
          }, 50);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [isCounterVisible]);

  return (
    <div className="min-h-screen relative font-poppins">
      {/* Animated background dots */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-white/70 rounded-full transition-all duration-300 ${
            isPlaying 
              ? "animate-pulse" 
              : "opacity-60"
          }`}
          style={{
            position: 'absolute',
            left: `${20 + (i * 15)}%`,
            top: `${30 + (i * 10)}%`,
            height: isPlaying ? `${20 + (i * 10)}px` : '10px',
            zIndex: 1
          }}
        />
      ))}

      {/* Dynamic Background - crisp and clear by default */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${currentBg})`,
          filter: `blur(${bgSharpness[0]}px)`,
          opacity: bgOpacity[0] / 100
        }}
      />
      
      {/* Background overlay - only show when opacity is less than 100% */}
      {bgOpacity[0] < 100 && (
        <div 
          className="fixed inset-0 transition-all duration-1000"
          style={{
            background: `linear-gradient(135deg, rgba(0, 0, 0, ${0.3 + (100 - bgOpacity[0]) * 0.007}) 0%, rgba(0, 0, 0, ${0.2 + (100 - bgOpacity[0]) * 0.005}) 100%)`
          }}
        />
      )}

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-white" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg font-poppins">
              ARKOLIA QURAN
            </h1>
          </div>
          
          <Dialog open={showControls} onOpenChange={setShowControls}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => setShowControls(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-black/90 backdrop-blur-xl border border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Customize Experience
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  Personalize your visual and audio experience
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Background Images Grid */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Background Images
                  </h4>
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
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                          {img.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opacity Slider */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Background Opacity: {bgOpacity[0]}%
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Background Sharpness: {bgSharpness[0] === 0 ? 'Sharp' : `${bgSharpness[0]}px blur`}
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

                {/* Block Darkness */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Block Darkness: {blockDarkness[0]}%</label>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Border Thickness: {borderThickness[0]}px</label>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Border Opacity: {borderOpacity[0]}%</label>
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
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white">Number Circle Color</h4>
                  <div className="flex flex-wrap gap-2">
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
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Welcome Section */}
        <div 
          ref={counterRef} 
          className="text-center mb-8 p-6 md:p-8 lg:p-12 backdrop-blur-xl rounded-2xl border border-white/20"
          style={{ 
            background: `linear-gradient(135deg, rgba(0, 0, 0, ${blockDarkness[0] / 100}) 0%, rgba(0, 0, 0, ${(blockDarkness[0] - 10) / 100}) 100%)`,
            borderWidth: `${borderThickness[0]}px`,
            borderColor: `rgba(255, 255, 255, ${borderOpacity[0] / 100})`
          }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg font-poppins">
            Welcome to Your Spiritual Journey
          </h2>
          <p className="text-white/90 text-sm md:text-base lg:text-lg mb-6 max-w-2xl mx-auto font-poppins">
            Immerse yourself in the divine beauty of the Holy Quran with our comprehensive collection of recitations, tafseer, and spiritual guidance.
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg font-poppins">{surahCount}</div>
              <div className="text-white/80 text-xs md:text-sm font-poppins">Surahs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg font-poppins">{audioCount}+</div>
              <div className="text-white/80 text-xs md:text-sm font-poppins">Audio Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg font-poppins">{hoursCount}+</div>
              <div className="text-white/80 text-xs md:text-sm font-poppins">Hours Content</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D3029] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Surahs..."
                  className="w-full pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg text-[#0D3029] placeholder-[#0D3029]/60 focus:outline-none focus:ring-2 focus:ring-[#0D3029] font-poppins text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/90 backdrop-blur-sm border-white/30 text-[#0D3029] hover:bg-white/80 font-poppins text-sm px-4 py-2 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="bg-[#0D3029] text-white text-xs px-1.5 py-0.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-white hover:bg-white/20 backdrop-blur-sm font-poppins text-sm px-4 py-2"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20">
                {/* Type Filter */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white/90 border-white/30 text-[#0D3029] font-poppins">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Makkan">Makkan</SelectItem>
                    <SelectItem value="Medinan">Medinan</SelectItem>
                  </SelectContent>
                </Select>

                {/* Length Filter */}
                <Select value={selectedLength} onValueChange={setSelectedLength}>
                  <SelectTrigger className="bg-white/90 border-white/30 text-[#0D3029] font-poppins">
                    <SelectValue placeholder="All Lengths" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Lengths</SelectItem>
                    <SelectItem value="Short">Short</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Long">Long</SelectItem>
                  </SelectContent>
                </Select>

                {/* Usage Filter */}
                <Select value={selectedUsage} onValueChange={setSelectedUsage}>
                  <SelectTrigger className="bg-white/90 border-white/30 text-[#0D3029] font-poppins">
                    <SelectValue placeholder="All Usage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Usage</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Protection">Protection</SelectItem>
                    <SelectItem value="Before Sleep">Before Sleep</SelectItem>
                    <SelectItem value="Ramadan">Ramadan</SelectItem>
                    <SelectItem value="Hajj">Hajj</SelectItem>
                    <SelectItem value="Victory">Victory</SelectItem>
                    <SelectItem value="Salah">Salah</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sajdah Filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sajdah"
                    checked={showSajdah}
                    onChange={(e) => setShowSajdah(e.target.checked)}
                    className="rounded border-white/30"
                  />
                  <label htmlFor="sajdah" className="text-white font-poppins text-sm">Only Sajdah Surahs</label>
                </div>

                {/* Themes Filter */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <ToggleGroup 
                    type="multiple" 
                    value={selectedThemes} 
                    onValueChange={setSelectedThemes}
                    className="flex flex-wrap gap-2"
                  >
                    {["Tawheed", "Stories", "Laws", "Commands", "Worship", "Qiyamah", "Duas", "Lessons", "Protection"].map(theme => (
                      <ToggleGroupItem 
                        key={theme} 
                        value={theme}
                        className="bg-white/90 text-[#0D3029] hover:bg-white/80 data-[state=on]:bg-[#0D3029] data-[state=on]:text-white font-poppins text-sm"
                      >
                        {theme}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>
            )}
          </div>

          {/* Main View Switch */}
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            <Button
              variant={mainView === "recent" ? "default" : "outline"}
              onClick={() => setMainView("recent")}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                mainView === "recent"
                  ? "bg-white text-[#0D3029] hover:bg-white/90"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              <Clock className="w-4 h-4 mr-1 md:mr-2" />
              Recent
            </Button>
            <Button
              variant={mainView === "surahs" ? "default" : "outline"}
              onClick={() => setMainView("surahs")}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                mainView === "surahs"
                  ? "bg-white text-[#0D3029] hover:bg-white/90"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1 md:mr-2" />
              Surahs
            </Button>
            <Button
              variant={mainView === "favourites" ? "default" : "outline"}
              onClick={() => setMainView("favourites")}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                mainView === "favourites"
                  ? "bg-white text-[#0D3029] hover:bg-white/90"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              <Heart className="w-4 h-4 mr-1 md:mr-2" />
              Favourites
            </Button>
            <Button
              variant={mainView === "completed" ? "default" : "outline"}
              onClick={() => setMainView("completed")}
              className={`px-3 md:px-6 py-2 md:py-3 rounded-lg font-poppins font-medium transition-all duration-300 text-xs md:text-sm ${
                mainView === "completed"
                  ? "bg-white text-[#0D3029] hover:bg-white/90"
                  : "bg-white/20 text-white border-white/30 hover:bg-white/30"
              }`}
            >
              <Headphones className="w-4 h-4 mr-1 md:mr-2" />
              Completed
            </Button>
          </div>

          {/* Main Content Based on View */}
          {mainView === "surahs" && (
            <div className="space-y-4">
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
                          ? 'rgba(139, 69, 19, 0.3)' 
                          : 'rgba(13, 48, 41, 0.3)'} 0%, rgba(0, 0, 0, 0.4) 100%)`,
                        borderWidth: `${borderThickness[0]}px`,
                        borderColor: getBorderColor(surah.type, isExpanded),
                        borderStyle: 'solid'
                      }}
                      onClick={() => handleSurahClick(surah)}
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 md:gap-4 flex-1">
                            <div 
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base border-2 border-white/30"
                              style={{ backgroundColor: numberBgColor }}
                            >
                              {surah.id}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg text-white font-poppins drop-shadow-lg">{surah.name}</h3>
                                <Badge className={`${getBadgeColor(surah.type)} text-white text-xs px-2 py-1 font-poppins font-medium hover:opacity-80 transition-opacity`}>
                                  {surah.type}
                                </Badge>
                                <Badge className="bg-[#60543D] hover:bg-[#60543D]/80 text-white text-xs px-2 py-0.5 font-poppins transition-colors">
                                  {surah.verses} verses
                                </Badge>
                                {surah.sajdah && (
                                  <Badge className="bg-[#4B4155] hover:bg-[#4B4155]/80 text-white text-xs px-2 py-0.5 font-poppins transition-colors">
                                    Sajdah
                                  </Badge>
                                )}
                              </div>
                              <p className="text-white/80 text-sm md:text-base font-poppins">{surah.nameArabic}</p>
                              <p className="text-white/70 text-xs md:text-sm mt-1 font-poppins">
                                Juz {surah.juz} • {surah.length} • {surah.themes.join(", ")}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-white/70 transition-transform duration-300 ${isExpanded ? 'transform rotate-90' : ''}`} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Expanded Tracks */}
                    {isExpanded && (
                      <div className="ml-4 md:ml-8 mt-2 space-y-2">
                        {mockTracks.map((track) => (
                          <Card 
                            key={track.id} 
                            className="backdrop-blur-xl hover:bg-black/60 transition-all duration-300 shadow-2xl"
                            style={{ 
                              background: `linear-gradient(135deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.40) 100%)`,
                              borderWidth: "2px",
                              borderStyle: 'solid',
                              borderColor: getTrackBorderColor(surah.type),
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
                                      <Heart className="w-4 h-4" fill={favoriteTrackIds.has(track.id) ? "currentColor" : "none"} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShare(track);
                                      }}
                                    >
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(track);
                                      }}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <Button
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 px-3 py-1.5 h-auto font-poppins text-xs backdrop-blur-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTrackPlay(track, surah);
                                    }}
                                  >
                                    {playingTrack === track.id ? (
                                      <Pause className="w-3 h-3 mr-1" />
                                    ) : (
                                      <Play className="w-3 h-3 mr-1" />
                                    )}
                                    {playingTrack === track.id ? "Playing" : "Play"}
                                  </Button>
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
              
              {filteredSurahs.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Search className="w-8 h-8 text-white/70" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-poppins">No Surahs Found</h3>
                  <p className="text-white/70 font-poppins">Try adjusting your search criteria or clear filters to see more results.</p>
                  <Button 
                    onClick={clearFilters}
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30 font-poppins"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {mainView === "recent" && (
            <div className="space-y-4">
              {isLoadingRSS ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                  <p className="text-white/70 font-poppins">Loading recent tracks...</p>
                </div>
              ) : rssError ? (
                <div className="text-center py-12">
                  <p className="text-red-400 font-poppins">Error loading recent tracks</p>
                </div>
              ) : rssData?.length > 0 ? (
                rssData.map((track) => (
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
                            {track.title}
                          </h4>
                          <p className="text-white/80 text-xs md:text-sm font-poppins">
                            {track.surahName} {track.verseRange && `• ${track.verseRange}`} • {track.date}
                          </p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 bg-white/70 rounded-full transition-all duration-300 ${
                                  audioState.isPlaying && audioCurrentTrack?.id === track.id
                                    ? "animate-pulse" 
                                    : "opacity-60"
                                }`}
                                style={{
                                  height: audioState.isPlaying && audioCurrentTrack?.id === track.id ? `${8 + (i * 2)}px` : '4px'
                                }}
                              />
                            ))}
                          </div>
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
                            <Heart className="w-4 h-4" fill={favoriteTrackIds.has(track.id) ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(track);
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(track);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 px-3 py-1.5 h-auto font-poppins text-xs backdrop-blur-sm"
                            onClick={() => {
                              if (track.audioUrl) {
                                handleTrackPlay(track, null);
                              } else {
                                toast({
                                  title: "Audio not available",
                                  description: "This track doesn't have an audio file",
                                  duration: 2000,
                                });
                              }
                            }}
                          >
                            {audioState.isPlaying && audioCurrentTrack?.id === track.id ? (
                              <>
                                <Pause className="w-3 h-3 mr-1" />
                                Playing
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Play
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/70 font-poppins">No recent tracks available</p>
                </div>
              )}
            </div>
          )}

          {mainView === "favourites" && (
            <div className="space-y-4">
              {favoriteTrackIds.size === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-8 h-8 text-white/70" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-poppins">No Favourites Yet</h3>
                  <p className="text-white/70 font-poppins">Mark tracks as favorites by clicking the heart icon.</p>
                </div>
              ) : (
                [...favoriteTrackIds].map((trackId) => {
                  const track = rssData?.find(t => t.id === trackId) || mockTracks.find(t => t.id === trackId);
                  if (!track) return null;
                  
                  return (
                    <Card 
                     key={String(trackId)} 
                     className="backdrop-blur-xl border-white/30 hover:bg-white/15 transition-all duration-300"
                     style={{ 
                       background: `linear-gradient(135deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.30) 100%)`,
                       borderWidth: "2px",
                       borderStyle: 'solid',
                       borderColor: "rgba(255, 255, 255, 0.3)",
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
                             {'surahName' in track ? track.surahName || 'Unknown Surah' : 'Unknown Surah'} {track.verseRange && `• ${track.verseRange}`} • {track.duration}
                           </p>
                         </div>
                         <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2">
                           <Button
                             size="sm"
                             variant="ghost"
                             className="w-8 h-8 p-0 text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                             onClick={(e) => {
                               e.stopPropagation();
                               toggleFavorite(track.id);
                             }}
                           >
                             <Heart className="w-4 h-4" fill="currentColor" />
                           </Button>
                           <Button
                             size="sm"
                             variant="ghost"
                             className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleShare(track);
                             }}
                           >
                             <Share2 className="w-4 h-4" />
                           </Button>
                           <Button
                             size="sm"
                             variant="ghost"
                             className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDownload(track);
                             }}
                           >
                             <Download className="w-4 h-4" />
                           </Button>
                           <Button
                             size="sm"
                             className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 px-3 py-1.5 h-auto font-poppins text-xs backdrop-blur-sm"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleTrackPlay(track, null);
                             }}
                           >
                             {playingTrack === track.id ? (
                               <>
                                 <Pause className="w-3 h-3 mr-1" />
                                 Playing
                               </>
                             ) : (
                               <>
                                 <Play className="w-3 h-3 mr-1" />
                                 Play
                               </>
                             )}
                           </Button>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                  );
                })
              )}
            </div>
          )}

          {mainView === "completed" && (
            <div className="space-y-4">
              {completedTrackIds.size === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Headphones className="w-8 h-8 text-white/70" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-poppins">No Completed Tracks</h3>
                  <p className="text-white/70 font-poppins">Tracks you've listened to will appear here.</p>
                </div>
              ) : (
                [...completedTrackIds].map((trackId: any) => {
                  const track = mockTracks.find(t => t.id === trackId) || {
                    id: trackId,
                    title: `Track ${trackId}`,
                    verseRange: "1-10",
                    duration: "3:00"
                  };
                  
                  return (
                    <Card 
                      key={track.id} 
                      className="backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.30) 100%)`,
                        borderWidth: "2px",
                        borderStyle: 'solid',
                        borderColor: "rgba(255, 255, 255, 0.2)",
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
                              Verses {track.verseRange} • {track.duration} • Completed
                            </p>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2">
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
                              <Heart className="w-4 h-4" fill={favoriteTrackIds.has(track.id) ? "currentColor" : "none"} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(track);
                              }}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(track);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 px-3 py-1.5 h-auto font-poppins text-xs backdrop-blur-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackPlay(track, null);
                              }}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Replay
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>
      </header>

      {/* Audio Player */}
      {audioCurrentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 p-4 z-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Track Info */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <h4 className="font-medium text-white font-poppins text-sm truncate">
                  {audioCurrentTrack.title}
                </h4>
                <p className="text-white/70 text-xs font-poppins truncate">
                  {audioCurrentTrack.surahName}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    // Previous track logic would go here
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={togglePlayPause}
                  disabled={audioState.isLoading}
                >
                  {audioState.isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : audioState.isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    // Next track logic would go here
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center gap-2 text-xs text-white/70 mb-1">
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
                <div 
                  className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const newTime = percent * audioState.duration;
                    seek(newTime);
                  }}
                >
                  <div 
                    className="h-full bg-white/70 transition-all duration-300"
                    style={{ width: audioState.duration > 0 ? `${(audioState.currentTime / audioState.duration) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-16">
        <div 
          className="p-6 md:p-8 lg:p-12 backdrop-blur-xl border-t border-white/20"
          style={{ 
            background: `linear-gradient(135deg, rgba(0, 0, 0, ${blockDarkness[0] / 100}) 0%, rgba(0, 0, 0, ${(blockDarkness[0] - 10) / 100}) 100%)`
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white font-semibold text-lg mb-4 font-poppins">ARKOLIA QURAN</h3>
                <p className="text-white/80 text-sm font-poppins leading-relaxed">
                  Experience the divine beauty of the Holy Quran through our comprehensive collection of recitations and spiritual guidance.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold text-base mb-4 font-poppins">Quick Links</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li><button onClick={() => setMainView("surahs")} className="hover:text-white transition-colors font-poppins">All Surahs</button></li>
                  <li><button onClick={() => setMainView("recent")} className="hover:text-white transition-colors font-poppins">Recent</button></li>
                  <li><button onClick={() => setMainView("favourites")} className="hover:text-white transition-colors font-poppins">Favourites</button></li>
                  <li><button onClick={() => setMainView("completed")} className="hover:text-white transition-colors font-poppins">Completed</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold text-base mb-4 font-poppins">Features</h4>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="font-poppins">📖 114 Complete Surahs</li>
                  <li className="font-poppins">🎵 High Quality Audio</li>
                  <li className="font-poppins">🔍 Advanced Search & Filters</li>
                  <li className="font-poppins">❤️ Personal Favourites</li>
                  <li className="font-poppins">🎨 Customizable Interface</li>
                </ul>
              </div>
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