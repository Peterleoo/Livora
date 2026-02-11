import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/Icon';
import { Property } from '../types';

interface ExploreScreenProps {
    onPropertyClick: (id: string) => void;
    properties: Property[];
    onBack: () => void;
    favoriteIds?: Set<string>;
    onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
    currentCity: string;
}

// City -> District -> Area Mapping
// In a real app, this would fetch from an API
const CITY_AREAS: Record<string, Record<string, string[]>> = {
    '深圳市': {
        '南山区': ['科技园', '后海', '深圳湾', '西丽', '南头'],
        '福田区': ['会展中心', '车公庙', '上下沙', '梅林'],
        '宝安区': ['宝安中心', '西乡', '翻身'],
        '罗湖区': ['东门', '国贸', '黄贝岭']
    },
    '长沙市': {
        '雨花区': ['洞井', '高桥', '东塘', '雨花亭'],
        '芙蓉区': ['芙蓉广场', '火车站', '万家丽'],
        '天心区': ['五一广场', '南门口', '省政府'],
        '岳麓区': ['大学城', '梅溪湖', '洋湖'],
        '开福区': ['四方坪', '广电']
    },
    '杭州市': {
        '滨江区': ['奥体中心', '长河', '浦沿'],
        '西湖区': ['文三路', '西溪', '古翠路'],
        '余杭区': ['未来科技城', '良渚'],
        '上城区': ['湖滨', '四季青']
    }
};

// Filter Constants
const PRICE_RANGES = [
    { label: '不限', min: 0, max: 100000 },
    { label: '2k以下', min: 0, max: 2000 },
    { label: '2k-4k', min: 2000, max: 4000 },
    { label: '4k-6k', min: 4000, max: 6000 },
    { label: '6k-8k', min: 6000, max: 8000 },
    { label: '8k以上', min: 8000, max: 100000 },
];

const BED_OPTIONS = [
    { label: '一室', value: 1 },
    { label: '二室', value: 2 },
    { label: '三室', value: 3 },
    { label: '四室+', value: 4 }, // Logic: >= 4
];

const AMENITIES = [
    '近地铁', 'VR看房', '电梯', '民水民电', '可养宠', '带阳台', '精装修', '近商圈'
];

const SORT_OPTIONS = [
    { label: '综合排序', value: 'DEFAULT' },
    { label: '价格从低到高', value: 'PRICE_ASC' },
    { label: '价格从高到低', value: 'PRICE_DESC' },
    { label: '匹配度优先', value: 'MATCH_DESC' },
];

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
    onPropertyClick,
    properties,
    onBack,
    favoriteIds = new Set(),
    onToggleFavorite,
    currentCity
}) => {
    // State for Filters
    const [showFilter, setShowFilter] = useState(false);

    // Location State
    const [activeDistrict, setActiveDistrict] = useState('不限');
    const [activeArea, setActiveArea] = useState('不限');

    const [activePriceIndex, setActivePriceIndex] = useState(0);
    const [selectedBeds, setSelectedBeds] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState('DEFAULT');

    // Quick Tab State (Visual only, could be linked to filters easily)
    const [quickTab, setQuickTab] = useState('推荐');

    // Derived Districts based on current City
    const currentDistricts = useMemo(() => {
        if (!currentCity || !CITY_AREAS[currentCity]) return [];
        return Object.keys(CITY_AREAS[currentCity]);
    }, [currentCity]);

    // Derived Areas based on active District
    const currentAreas = useMemo(() => {
        if (!currentCity || activeDistrict === '不限' || !CITY_AREAS[currentCity]) return [];
        return CITY_AREAS[currentCity][activeDistrict] || [];
    }, [currentCity, activeDistrict]);

    // --- Filtering Logic ---
    const filteredProperties = useMemo(() => {
        let result = [...properties];

        // 1. Location Filter (District & Area)
        if (activeDistrict !== '不限') {
            // Check if location string contains the District
            // e.g., "南山区 · 科技园" includes "南山" or "南山区"
            // To be robust, we match strictly if possible, or loose match
            result = result.filter(p => p.location.includes(activeDistrict));
        }

        if (activeArea !== '不限') {
            // e.g., "南山区 · 科技园" includes "科技园"
            result = result.filter(p => p.location.includes(activeArea));
        }

        // 2. Price Filter
        const priceRange = PRICE_RANGES[activePriceIndex];
        result = result.filter(p => p.price >= priceRange.min && p.price < priceRange.max);

        // 3. Bed Filter (OR logic between selections)
        if (selectedBeds.length > 0) {
            result = result.filter(p => {
                if (selectedBeds.includes(4)) {
                    return selectedBeds.some(b => b === p.specs.beds) || p.specs.beds >= 4;
                }
                return selectedBeds.includes(p.specs.beds);
            });
        }

        // 4. Tags Filter (AND logic - must match all selected tags)
        if (selectedTags.length > 0) {
            result = result.filter(p => {
                const combinedTags = [...p.tags, ...p.facilities, p.subway ? '近地铁' : ''].join(',');
                return selectedTags.every(tag => combinedTags.includes(tag));
            });
        }

        // 5. Sorting
        if (sortOption === 'PRICE_ASC') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'PRICE_DESC') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'MATCH_DESC') {
            result.sort((a, b) => b.matchScore - a.matchScore);
        }

        return result;
    }, [properties, activeDistrict, activeArea, activePriceIndex, selectedBeds, selectedTags, sortOption]);

    // Handlers
    const handleDistrictChange = (district: string) => {
        setActiveDistrict(district);
        setActiveArea('不限'); // Reset area when district changes
    };

    const toggleBed = (val: number) => {
        setSelectedBeds(prev => prev.includes(val) ? prev.filter(b => b !== val) : [...prev, val]);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const resetFilters = () => {
        setActiveDistrict('不限');
        setActiveArea('不限');
        setActivePriceIndex(0);
        setSelectedBeds([]);
        setSelectedTags([]);
        setSortOption('DEFAULT');
    };

    // Check if any filter is active for the badge
    const isFilterActive = activeDistrict !== '不限' || activePriceIndex !== 0 || selectedBeds.length > 0 || selectedTags.length > 0;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-[#101010] pb-6 relative">
            {/* Header with Back Button */}
            <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#101010]/90 backdrop-blur-md px-4 pt-safe-top pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mt-2 mb-2">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020]"
                    >
                        <Icon name="arrow_back" className="text-slate-900 dark:text-white" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">发现 · {currentCity}</h1>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilter(true)}
                        className={`p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#202020] transition-colors relative ${isFilterActive ? 'text-primary' : 'text-slate-900 dark:text-white'
                            }`}
                    >
                        <Icon name="tune" />
                        {isFilterActive && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#101010]"></span>
                        )}
                    </button>
                </div>
                {/* Quick Categories Pills */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {['推荐', 'VR看房', '近地铁', '整租', '合租', '短租'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setQuickTab(cat)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${quickTab === cat
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none'
                                : 'bg-white dark:bg-[#1a1a1a] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Property List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                <div className="space-y-6 pb-20">
                    {filteredProperties.length > 0 ? filteredProperties.map(item => {
                        const isVR = item.tags.includes('VR看房');
                        const isFavorite = favoriteIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => onPropertyClick(item.id)}
                                className="bg-white dark:bg-[#1a1a1a] rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden active:scale-[0.99] transition-transform duration-200 group relative"
                            >
                                {/* Image Section */}
                                <div className="relative h-60 w-full">
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />

                                    {/* Top Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-white/10">
                                            <Icon name="bolt" size={14} className="text-yellow-400" />
                                            <span className="text-xs font-bold">{item.matchScore}% 匹配</span>
                                        </div>
                                        {isVR && (
                                            <div className="bg-white/90 backdrop-blur-md text-slate-900 px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg text-[10px] font-bold">
                                                <Icon name="360" size={14} className="text-primary" /> VR
                                            </div>
                                        )}
                                    </div>

                                    {/* Favorite Button */}
                                    <button
                                        onClick={(e) => onToggleFavorite && onToggleFavorite(item.id, e)}
                                        className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 ${isFavorite ? 'text-red-500 bg-white/90' : 'text-white hover:bg-white/20'}`}
                                    >
                                        <Icon name={isFavorite ? "favorite" : "favorite_border"} size={18} className={isFavorite ? "font-variation-settings-filled" : ""} />
                                    </button>

                                    {/* Bottom Gradient for Image Info */}
                                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                        <div className="flex items-center gap-2 text-white/90 text-[10px] font-medium">
                                            <span className="flex items-center gap-1"><Icon name="visibility" size={12} /> 1,234 浏览</span>
                                            <span className="w-0.5 h-2 bg-white/40 rounded-full"></span>
                                            <span>{item.floor}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 pt-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 flex-1 mr-2">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-3">
                                        <Icon name="location_on" size={14} className="text-slate-400 shrink-0" />
                                        <span className="truncate">{item.location}</span>
                                        {item.subway && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span className="truncate text-blue-500/80">{item.subway.split(' ')[0]}</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-4 h-6 overflow-hidden">
                                        {item.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] rounded-[6px] font-medium border border-slate-200 dark:border-slate-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-50 dark:bg-slate-800 mb-3"></div>

                                    {/* Footer: Price & Actions */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-baseline gap-0.5 text-red-500">
                                                <span className="text-xs font-bold">¥</span>
                                                <span className="text-xl font-bold font-display">{item.price}</span>
                                                <span className="text-xs text-slate-400 font-normal ml-0.5">/月</span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5 flex gap-2">
                                                <span>{item.specs.beds}室{item.specs.baths}卫</span>
                                                <span className="w-px h-2.5 bg-slate-200 dark:bg-slate-700 self-center"></span>
                                                <span>{item.specs.area}㎡</span>
                                                <span className="w-px h-2.5 bg-slate-200 dark:bg-slate-700 self-center"></span>
                                                <span>{item.direction}</span>
                                            </div>
                                        </div>

                                        <button className="flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 text-primary px-3 py-2 rounded-xl text-xs font-bold transition-colors">
                                            <Icon name="smart_toy" size={16} />
                                            问 AI
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="flex flex-col items-center justify-center pt-20">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Icon name="search_off" size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-medium">没有找到符合条件的房源</p>
                            <p className="text-xs text-slate-400 mt-1">试试调整筛选条件？</p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold"
                            >
                                清空筛选
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Modal (Bottom Sheet) */}
            <AnimatePresence>
                {showFilter && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilter(false)}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] rounded-t-[32px] overflow-hidden flex flex-col h-[85vh]"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">筛选房源</h2>
                                <button onClick={resetFilters} className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                    重置
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">

                                {/* 0. Location (Region & Business District) - New Design */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">区域商圈</h3>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden flex h-64 border border-slate-100 dark:border-slate-700">
                                        {/* Left: Districts */}
                                        <div className="w-1/3 bg-slate-100 dark:bg-slate-900/50 overflow-y-auto border-r border-slate-200 dark:border-slate-700">
                                            <button
                                                onClick={() => handleDistrictChange('不限')}
                                                className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${activeDistrict === '不限'
                                                    ? 'bg-white dark:bg-slate-800 text-primary border-l-4 border-primary'
                                                    : 'text-slate-500 border-l-4 border-transparent'
                                                    }`}
                                            >
                                                全城
                                            </button>
                                            {currentDistricts.map(dist => (
                                                <button
                                                    key={dist}
                                                    onClick={() => handleDistrictChange(dist)}
                                                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${activeDistrict === dist
                                                        ? 'bg-white dark:bg-slate-800 text-primary border-l-4 border-primary'
                                                        : 'text-slate-500 border-l-4 border-transparent'
                                                        }`}
                                                >
                                                    {dist}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Right: Areas (Business Districts) */}
                                        <div className="flex-1 overflow-y-auto p-3">
                                            {activeDistrict === '不限' ? (
                                                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                                                    请先选择行政区
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => setActiveArea('不限')}
                                                        className={`px-2 py-2 rounded-lg text-xs font-bold transition-all border ${activeArea === '不限'
                                                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-slate-200 text-slate-500'
                                                            }`}
                                                    >
                                                        全{activeDistrict}
                                                    </button>
                                                    {currentAreas.map(area => (
                                                        <button
                                                            key={area}
                                                            onClick={() => setActiveArea(area)}
                                                            className={`px-2 py-2 rounded-lg text-xs font-bold transition-all border ${activeArea === area
                                                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-slate-200 text-slate-500'
                                                                }`}
                                                        >
                                                            {area}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 1. Sort Order */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">排序方式</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SORT_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setSortOption(opt.value)}
                                                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${sortOption === opt.value
                                                    ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                                                    : 'bg-slate-50 border-transparent text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Price Range */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">预算范围 (月租)</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {PRICE_RANGES.map((range, idx) => (
                                            <button
                                                key={range.label}
                                                onClick={() => setActivePriceIndex(idx)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activePriceIndex === idx
                                                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                                                    : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                                    }`}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Layout / Beds */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">户型选择</h3>
                                    <div className="flex gap-3">
                                        {BED_OPTIONS.map((bed) => (
                                            <button
                                                key={bed.value}
                                                onClick={() => toggleBed(bed.value)}
                                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${selectedBeds.includes(bed.value)
                                                    ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                                                    : 'bg-slate-50 border-transparent text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}
                                            >
                                                {bed.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 4. Amenities */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">特色标签</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {AMENITIES.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${selectedTags.includes(tag)
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-400'
                                                    : 'bg-slate-50 border-transparent text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Button */}
                            <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-slate-100 dark:border-slate-800 pb-safe-bottom shrink-0">
                                <button
                                    onClick={() => setShowFilter(false)}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex justify-center items-center gap-2"
                                >
                                    查看 {filteredProperties.length} 套房源
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
