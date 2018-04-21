function getLimitGapIndex (value, gapList) {
    for (var i = 1;i < gapList.length ;i++) {
        if ( value >= gapList[i - 1] && value < gapList[i]){
            return i - 1 
        }
    }
}

function getNoneLimitGapIndex ( value, gapList ) {
    var index = 0
    for (var i = 0;i < gapList.length ;i++) {
        if ( value < gapList[i]){
            break
        }
        index ++
    }
    if (index > gapList.length) index = gapList.length - 1
    return index
}

function checkNumberInput (value, callback, content) {
    let num = parseFloat(value)
    if (isNaN(num)) {
        callback('error', content)
        return null
    }
    return num
}

const male = 'male'
const female = 'female'
const LDL = 'LDL'
const Chol = 'Chol'
const mmol = 'mmol'
const mg = 'mg'

const ageGapList = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
const agePtsList = {
    male: {
        LDL: [-1, 0, 1, 2, 3, 4, 5, 6, 7],
        Chol: [-1, 0, 1, 2, 3, 4, 5, 6, 7]
    },
    female: {
        LDL: [-9, -4, 0, 3, 6, 7, 8, 8, 8],
        Chol: [-9, -4, 0, 3, 6, 7, 8, 8, 8]
    }
} 

const ldlOrCholGapList = {
    male: {
        LDL: {
            mg: [100, 130, 160, 190],
            mmol:[2.60, 3.37, 4.15, 4.92]
        },
        Chol: {
            mg: [160, 200, 240, 280],
            mmol: [4.14, 5.18, 6.22, 7.25]
        }
    }, 
    female: {
        LDL: {
            mg: [100, 130, 160, 190],
            mmol:[2.60, 3.37, 4.15, 4.92]
        },
        Chol: {
            mg: [160, 200, 240, 280],
            mmol: [4.14, 5.18, 6.22, 7.25]
        }
    }
}
const ldlOrCholPtsList = {
    male: {
        LDL: [-3, 0, 0, 1, 2],
        Chol: [-3, 0, 1, 2, 3]
    }, 
    female: {
        LDL: [-3, 0, 0, 2, 2],
        Chol: [-2, 0, 1, 1, 3]
    }
}

const hdlGapList = {
    male: {
        mg: [35, 45, 50, 60],
        mmol: [0.9, 1.17, 1.30, 1.56 ] 
    },
    female: {
        mg: [35, 45, 50, 60],
        mmol: [0.9, 1.17, 1.30, 1.56 ] 
    }
}
const hdlPtsList = {
    male: {
        LDL: [2, 1, 0, 0, -1],
        Chol: [2, 1, 0, 0, -2] 
    }, female: {
        LDL: [5, 2, 1, 0, -2],
        Chol: [5, 2, 1, 0, -3] 
    }
}

const sysGapList = {
    male: [120, 130, 140, 160],
    female: [120, 130, 140, 160], 
}
const diaGapList = {
    male: [80, 85, 90, 100],
    female: [80, 85, 90, 100]
}

const bloodpressurePtsList = {
    male:[
        0,0,1,2,3,
        0,0,1,2,3,
        1,1,1,2,3,
        2,2,2,2,3,
        3,3,3,3,3],
    female: [
        -3,0,0,2,3,
        0,0,0,2,3,
        0,0,0,2,3,
        2,2,2,2,3,
        3,3,3,3,3
    ]
}

const DiabetesLDLNCholPts = {
    'no': {
        male: 0,
        female: 0
    },
    'yes': {
        male: 4,
        female: 4
    }
}
const SmokerLDLNCholPts = {
    'no': {
        male: 0,
        female: 0
    },
    'yes': {
        male: 2,
        female: 2
    }
}

const PtsTotalGapList = {
    male: {
        LDL: [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14],
        Chol: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    },
    female: {
        LDL: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17],
        Chol:[-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17]
    }
}
const PtsTotalRiskList = {
    male: {
        LDL: [1, 2, 2, 3, 4, 4, 6, 7, 9, 11, 14, 18, 22, 27, 33, 40, 47, 56],
        Chol: [2, 3, 3, 4, 5, 7, 8, 10, 13, 16, 20, 25, 31, 37, 45, 53]
    },
    female: {
        LDL: [1, 2, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 20, 24, 27, 32],
        Chol: [1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 10, 11, 13, 15, 18, 20, 24, 27]
    }
}

function caculateFraminghanModel(
    {sex, age, ldlOrChol, hdl, systolic, diastolic, diabetes, smoker}
    , callback
) {
    var ptsValue
    const ptType = ldlOrChol.type
    const ageIndex = getLimitGapIndex(age, ageGapList)
    const ldlOrCholIndex = getNoneLimitGapIndex(ldlOrChol.number, ldlOrCholGapList[sex][ptType][ldlOrChol.unit])
    const hdlIndex = getNoneLimitGapIndex(hdl.number, hdlGapList[sex][hdl.unit])
    var sysIndex = getNoneLimitGapIndex(systolic, sysGapList[sex])
    var diaIndex = getNoneLimitGapIndex(diastolic, diaGapList[sex])
    const diabetesPtValue = DiabetesLDLNCholPts[diabetes][sex]
    const smokerPtValue = SmokerLDLNCholPts[smoker][sex]

    // console.log({ageIndex, ldlOrCholIndex, hdlIndex, sysIndex, diaIndex, diabetesPtValue, smokerPtValue})

    var p1 = agePtsList[sex][ptType][ageIndex] 
    var p2 = ldlOrCholPtsList[sex][ptType][ldlOrCholIndex]
    var p3 = hdlPtsList[sex][ptType][hdlIndex]
    if ( sysIndex < diaIndex ) { sysIndex = diaIndex }
    else diaIndex = sysIndex
    var p4 = bloodpressurePtsList[sex][sysIndex * 5 + diaIndex]
    var p5 = diabetesPtValue + smokerPtValue
    // console.log({p1, p2, p3, p4, p5})

    ptsValue = p1 + p2 + p3 + p4 + p5
    const riskLevelIndex = getNoneLimitGapIndex(ptsValue, PtsTotalGapList[sex][ptType])
    // console.log(riskLevelIndex)
    const riskLevel = PtsTotalRiskList[sex][ptType][riskLevelIndex]

    callback('success','计算结果','患者(' + ptType + ')10年患病风险: ' + riskLevel + '%')
}

export default caculateFraminghanModel

// 将本例的一些方法导出
export {
    getLimitGapIndex,
    getNoneLimitGapIndex,
    checkNumberInput
}