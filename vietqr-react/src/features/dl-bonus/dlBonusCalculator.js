/**
 * DL Bonus Calculator
 * Công thức: Thưởng SI = (A + B) × C + D
 * 
 * A: Thưởng doanh số × Hệ số Pr3, Pr6
 * B: Thưởng đạt chỉ tiêu × Hệ số vượt chỉ tiêu
 * C: Hệ số đạt chỉ tiêu ngành hàng chính và tổng
 * D: Thưởng bảo hiểm
 */

// ==================== LOOKUP TABLES ====================

/**
 * Bảng hệ số % theo Scheme (A/B/C/D) và Kỳ hạn (tháng)
 * Đơn vị: %
 */
export const SCHEME_TERM_TABLE = {
    D: { '<12': 0, '>=12': 0, '>=15': 0, '>=18': 0, '>=24': 0 },
    C: { '<12': 0, '>=12': 0.1, '>=15': 0.3, '>=18': 0.4, '>=24': 0.5 },
    B: { '<12': 0.7, '>=12': 1, '>=15': 1.1, '>=18': 1.3, '>=24': 1.4 },
    A: { '<12': 0.9, '>=12': 1.2, '>=15': 1.3, '>=18': 1.5, '>=24': 1.6 },
};

/**
 * Bảng hệ số Pr3\Pr6
 */
export const PR3_PR6_TABLE = {
    '<75': { '<75': 0, '>=75': 0, '>=85': 0, 'N/A': 0 },
    '>=75': { '<75': 0, '>=75': 0.6, '>=85': 0.8, 'N/A': 0.8 },
    '>=85': { '<75': 0.2, '>=75': 0.8, '>=85': 1.1, 'N/A': 1 },
    '>=90': { '<75': 0.4, '>=75': 1, '>=85': 1.3, 'N/A': 1 },
    'N/A': { '<75': 0, '>=75': 0.8, '>=85': 1, 'N/A': 1 },
};

/**
 * Bảng thưởng đạt chỉ tiêu DL (đồng)
 */
export const TARGET_BONUS_TABLE = [
    { min: 300000000, bonus: 1800000 },
    { min: 200000000, bonus: 1300000 },
    { min: 150000000, bonus: 1100000 },
    { min: 100000000, bonus: 800000 },
    { min: 60000000, bonus: 600000 },
    { min: 0, bonus: 0 },
];

/**
 * Bảng hệ số vượt chỉ tiêu
 */
export const EXCEED_TARGET_TABLE = [
    { minPercent: 120, factor: 1.6 },
    { minPercent: 110, factor: 1.3 },
    { minPercent: 100, factor: 1.0 },
    { minPercent: 90, factor: 0.7 },
    { minPercent: 0, factor: 0 },
];

/**
 * Bảng hệ số đạt chỉ tiêu ngành hàng chính và tổng
 * Rows: %CT MC/ED, Cols: %CT Tổng
 */
export const CATEGORY_TABLE = {
    '<50': { '<=75': 0, '>=75': 0, '>=90': 0, '>=100': 0, '>=115': 0 },
    '>=50': { '<=75': 0, '>=75': 0.6, '>=90': 0.8, '>=100': 1.1, '>=115': 1.3 },
    '>=75': { '<=75': 0, '>=75': 0.7, '>=90': 0.9, '>=100': 1.2, '>=115': 1.5 },
    '>=90': { '<=75': 0, '>=75': 1, '>=90': 1.1, '>=100': 1.4, '>=115': 1.8 },
};

/**
 * Bảng thưởng bảo hiểm theo DSGN (triệu đồng) và Kỳ hạn
 */
export const INSURANCE_TABLE = [
    { minDsgn: 50000000, bonus: { 12: 34000, 15: 39000, 18: 44000 } },
    { minDsgn: 25000000, bonus: { 12: 26000, 15: 31000, 18: 36000 } },
    { minDsgn: 12000000, bonus: { 12: 18000, 15: 23000, 18: 28000 } },
    { minDsgn: 0, bonus: { 12: 10000, 15: 15000, 18: 20000 } },
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Xác định key kỳ hạn cho bảng SCHEME_TERM_TABLE
 */
export function getTermKey(termMonths) {
    const term = Number(termMonths) || 0;
    if (term >= 24) return '>=24';
    if (term >= 18) return '>=18';
    if (term >= 15) return '>=15';
    if (term >= 12) return '>=12';
    return '<12';
}

/**
 * Xác định key PR cho HÀNG (PR3) - bảng PR3_PR6_TABLE
 * Có các rows: <75, >=75, >=85, >=90, N/A
 */
export function getPrRowKey(prValue) {
    if (prValue === null || prValue === undefined || prValue === 'N/A') return 'N/A';
    const pr = Number(prValue) || 0;
    if (pr >= 90) return '>=90';
    if (pr >= 85) return '>=85';
    if (pr >= 75) return '>=75';
    return '<75';
}

/**
 * Xác định key PR cho CỘT (PR6) - bảng PR3_PR6_TABLE
 * Chỉ có các cột: <75, >=75, >=85, N/A (KHÔNG có >=90)
 */
export function getPrColKey(prValue) {
    if (prValue === null || prValue === undefined || prValue === 'N/A') return 'N/A';
    const pr = Number(prValue) || 0;
    // Cột chỉ có đến >=85, nếu >=90 thì vẫn dùng key >=85
    if (pr >= 85) return '>=85';
    if (pr >= 75) return '>=75';
    return '<75';
}

/**
 * Xác định key CT MC/ED cho bảng CATEGORY_TABLE (row)
 */
export function getCtMcEdKey(ctValue) {
    const ct = Number(ctValue) || 0;
    if (ct >= 90) return '>=90';
    if (ct >= 75) return '>=75';
    if (ct >= 50) return '>=50';
    return '<50';
}

/**
 * Xác định key CT Tổng cho bảng CATEGORY_TABLE (col)
 */
export function getCtTongKey(ctValue) {
    const ct = Number(ctValue) || 0;
    if (ct >= 115) return '>=115';
    if (ct >= 100) return '>=100';
    if (ct >= 90) return '>=90';
    if (ct >= 75) return '>=75';
    return '<=75';
}

/**
 * Xác định key kỳ hạn cho bảng INSURANCE_TABLE
 */
export function getInsuranceTermKey(termMonths) {
    const term = Number(termMonths) || 0;
    if (term >= 18) return 18;
    if (term >= 15) return 15;
    return 12;
}

// ==================== CALCULATION FUNCTIONS ====================

/**
 * Lấy hệ số % theo Scheme và Kỳ hạn (Phần A - step 1)
 */
export function getTermFactor(scheme, termMonths) {
    const schemeUpper = String(scheme).toUpperCase();
    if (!SCHEME_TERM_TABLE[schemeUpper]) return 0;
    const termKey = getTermKey(termMonths);
    return SCHEME_TERM_TABLE[schemeUpper][termKey] || 0;
}

/**
 * Lấy hệ số Pr3\Pr6 (Phần A - step 2)
 * PR3 dùng rows (có >=90), PR6 dùng cols (max >=85)
 */
export function getPr3Pr6Factor(pr3, pr6) {
    const pr3Key = getPrRowKey(pr3);
    const pr6Key = getPrColKey(pr6);

    if (!PR3_PR6_TABLE[pr3Key]) return 0;
    return PR3_PR6_TABLE[pr3Key][pr6Key] || 0;
}

/**
 * Lấy thưởng đạt chỉ tiêu DL (Phần B - step 1)
 */
export function getTargetBonus(chiTieuDL) {
    const chiTieu = Number(chiTieuDL) || 0;
    for (const row of TARGET_BONUS_TABLE) {
        if (chiTieu >= row.min) {
            return row.bonus;
        }
    }
    return 0;
}

/**
 * Lấy hệ số vượt chỉ tiêu (Phần B - step 2)
 */
export function getExceedFactor(percentDat) {
    const percent = Number(percentDat) || 0;
    for (const row of EXCEED_TARGET_TABLE) {
        if (percent >= row.minPercent) {
            return row.factor;
        }
    }
    return 0;
}

/**
 * Lấy hệ số đạt chỉ tiêu ngành hàng (Phần C)
 */
export function getCategoryFactor(ctMCED, ctTong) {
    const rowKey = getCtMcEdKey(ctMCED);
    const colKey = getCtTongKey(ctTong);

    if (!CATEGORY_TABLE[rowKey]) return 0;
    return CATEGORY_TABLE[rowKey][colKey] || 0;
}

/**
 * Lấy thưởng bảo hiểm cho 1 hợp đồng (Phần D)
 */
export function getInsuranceBonus(dsgn, kyHan, hasBaoHiem) {
    if (!hasBaoHiem || hasBaoHiem === 'N') return 0;

    const dsgnValue = Number(dsgn) || 0;
    const termKey = getInsuranceTermKey(kyHan);

    for (const row of INSURANCE_TABLE) {
        if (dsgnValue >= row.minDsgn) {
            return row.bonus[termKey] || 0;
        }
    }
    return 0;
}

/**
 * Tính thưởng cho 1 hợp đồng
 * Returns: { thuongDS, heSo, baoHiem }
 */
export function calculateContractBonus(contract, pr3, pr6) {
    const { kyHan, khoanVay, baoHiem, diemScheme } = contract;

    // Hệ số % theo scheme + kỳ hạn
    const heSo = getTermFactor(diemScheme, kyHan);

    // Thưởng doanh số = Doanh số giải ngân × Hệ số %
    const thuongDS = (Number(khoanVay) || 0) * (heSo / 100);

    // Thưởng bảo hiểm
    const baoHiemBonus = getInsuranceBonus(khoanVay, kyHan, baoHiem);

    return {
        thuongDS: Math.round(thuongDS),
        heSo,
        baoHiem: baoHiemBonus,
    };
}

/**
 * Tính tổng thưởng DL theo công thức (A + B) × C + D
 */
export function calculateDLBonus(formData, contracts) {
    const {
        targetDL = 0,
        targetED = 0,
        doanhSoED = 0,
        pr3DL = 0,
        pr6DL = 0,
    } = formData;

    // Tính tổng doanh số giải ngân DL từ các hợp đồng
    const tongDoanhSoDL = contracts.reduce((sum, c) => sum + (Number(c.khoanVay) || 0), 0);

    // % Đạt chỉ tiêu DL
    const percentDatDL = targetDL > 0 ? (tongDoanhSoDL / targetDL) * 100 : 0;

    // ====== TÍNH TỰ ĐỘNG %CT MC/ED VÀ %CT TỔNG ======

    // %CT MC/ED = Doanh số ED / Target ED (quy đổi %)
    const ctMCED_raw = targetED > 0 ? (doanhSoED / targetED) * 100 : 0;

    // %CT Tổng = (Doanh số ED + Doanh số DL) / (Target ED + Target DL) (quy đổi %)
    const tongDoanhSo = doanhSoED + tongDoanhSoDL;
    const tongTarget = targetED + targetDL;
    const ctTong_raw = tongTarget > 0 ? (tongDoanhSo / tongTarget) * 100 : 0;

    // ====== PHẦN A: Thưởng doanh số × Hệ số Pr3, Pr6 ======

    // Tính thưởng từng hợp đồng
    const contractResults = contracts.map(contract => {
        const result = calculateContractBonus(contract, pr3DL, pr6DL);
        return {
            ...contract,
            calculatedDS: result.thuongDS,
            calculatedHeSo: result.heSo,
            calculatedInsurance: result.baoHiem,
        };
    });

    // Tổng thưởng doanh số (chưa nhân hệ số Pr)
    const tongThuongDS = contractResults.reduce((sum, c) => sum + c.calculatedDS, 0);

    // Hệ số Pr3\Pr6
    const heSoPr = getPr3Pr6Factor(pr3DL, pr6DL);

    // A = Tổng thưởng DS × Hệ số Pr
    const A = tongThuongDS * heSoPr;

    // ====== PHẦN B: Thưởng đạt chỉ tiêu × Hệ số vượt chỉ tiêu ======

    // Thưởng đạt chỉ tiêu (tra bảng theo mức chỉ tiêu DL)
    const thuongDatChiTieu = getTargetBonus(targetDL);

    // Hệ số vượt chỉ tiêu (tra bảng theo % đạt)
    const heSoVuot = getExceedFactor(percentDatDL);

    // B = Thưởng đạt chỉ tiêu × Hệ số vượt
    const B = thuongDatChiTieu * heSoVuot;

    // ====== PHẦN C: Hệ số đạt chỉ tiêu ngành hàng ======
    // Dùng %CT MC/ED và %CT Tổng đã tính tự động để tra bảng
    const C = getCategoryFactor(ctMCED_raw, ctTong_raw);

    // ====== PHẦN D: Thưởng bảo hiểm ======
    const D = contractResults.reduce((sum, c) => sum + c.calculatedInsurance, 0);

    // ====== TỔNG THƯỞNG SI = (A + B) × C + D ======
    const tongThuongSI = (A + B) * C + D;

    return {
        // Kết quả từng hợp đồng
        contractResults,

        // Chi tiết công thức
        details: {
            A: Math.round(A),
            B: Math.round(B),
            C,
            D,
            heSoPr,
            thuongDatChiTieu,
            heSoVuot,
            tongDoanhSoDL,
            percentDatDL: percentDatDL.toFixed(2),
            // %CT tính tự động
            ctMCED: ctMCED_raw.toFixed(2),
            ctTong: ctTong_raw.toFixed(2),
            tongDoanhSo,
            tongTarget,
        },

        // Tổng thưởng
        tongThuongSI: Math.round(tongThuongSI),

        // Thưởng theo loại
        thuongDoanhSo: Math.round(A),
        thuongDatTarget: Math.round(B),
        thuongBaoHiem: D,
    };
}

export default calculateDLBonus;
