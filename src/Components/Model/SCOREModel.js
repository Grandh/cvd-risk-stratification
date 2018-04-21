import { getNoneLimitGapIndex } from './FraminghanModel'

const riskTableMenSmoker = [
    2,2,3,3,4,
    1,2,2,2,3,
    1,1,1,2,2,
    1,1,1,1,1,

    7,8,10,12,14,
    8,9,11,13,16,
    5,6,8,9,11,
    4,4,5,6,8,

    12,13,16,19,22,
    8,9,11,13,16,
    5,6,8,9,11,
    4,4,5,6,8,

    18,21,24,28,33,
    12,14,17,20,24,
    8,10,12,14,17,
    6,7,8,10,12,

    26,30,35,41,47,
    18,21,25,29,34,
    13,15,17,20,24,
    9,10,12,14,17
]
const riskTableMenNonSmoker = [
    1,1,1,2,2,
    1,1,1,1,1,
    0,1,1,1,1,
    0,0,1,1,1,

    4,4,5,6,7,
    2,3,3,4,5,
    2,2,2,3,3,
    1,1,2,2,2,

    6,7,8,10,12,
    4,5,6,7,8,
    3,3,4,5,6,
    2,2,3,3,4,

    7,11,13,15,18,
    6,7,9,10,12,
    4,5,6,7,9,
    3,3,4,5,6,

    14,16,19,22,26,
    9,11,13,15,16,
    6,8,9,11,13,
    4,5,6,7,8
]

const riskTableWomenSmoker = [
    0,0,0,1,1,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,

    2,2,3,3,4,
    1,2,2,2,3,
    1,1,1,1,2,
    1,1,1,1,1,

    4,5,5,6,7,
    3,3,4,4,5,
    2,2,2,3,3,
    1,1,2,2,2,

    8,9,10,11,12,
    5,6,7,8,9,
    3,4,5,5,6,
    2,3,3,4,4,

    13,15,17,19,22,
    9,10,12,13,16,
    6,7,8,9,11,
    4,5,5,6,7
]

const riskTableWomenNonSmoker = [
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,

    1,1,1,2,2,
    1,1,1,1,1,
    0,1,1,1,1,
    0,0,1,1,1,

    2,2,3,3,4,
    1,2,2,2,3,
    1,1,1,1,2,
    1,1,1,1,1,

    4,4,5,6,7,
    3,3,3,4,5,
    2,2,2,3,3,
    1,1,2,2,2,

    7,8,9,10,12,
    5,5,6,7,8,
    3,3,4,5,6,
    2,2,3,3,4

]

function caculateScoreModel({sex, age, smoker, systolic, cholesterol}, callback) {

    var index
    var riskTable = null
    if (sex = 'male') {
        if ( smoker === 'yes' ) {
            riskTable = riskTableMenSmoker
        }
        else {
            riskTable = riskTableMenNonSmoker
        }
    }
    else {
        if (smoker === 'yes') {
            riskTable = riskTableWomenSmoker
        }
        else {
            riskTable = riskTableWomenNonSmoker
        }
    }

    // 年龄
    const ageGap = [40,50,55,60,65]
    const ageBaseline = 20
    var ageIndex = 0
    for (var i = 0; i < ageGap.length - 1; i++) {
        if ( ageGap[i] <= age && age < ageGap[i+1]) {
            break
        }
        ageIndex ++
    }
    
    const systolicGap = [120,140,160,180]
    var systolicIndex = 0
    for ( i=0; i <systolicGap.length; i++) {
        if (systolic < systolicGap[i]) {
            break
        }
        systolicIndex ++
    }

    const cholesterolMMOLGap = [4,5,6,7,8]
    const cholesterolMGGap = [150,200,250,300]
    var cholesterolIndex = 0
    const cholesterolValue = cholesterol.number
    const cholesterolUnit = cholesterol.unit
    if (cholesterolUnit === 'mmol') {
        for ( i = 0 ; i < cholesterolMMOLGap.length ; i++) {
            if (cholesterolValue <= cholesterolMMOLGap[i]) {
                break
            }
            cholesterolIndex ++
        }
    } else { // mg/dl
        cholesterolIndex = getNoneLimitGapIndex(cholesterolValue, cholesterolMGGap)
    }
    if (cholesterolIndex >= 5) cholesterolIndex = 4 

    index = ageIndex * ageBaseline + ( 4 - systolicIndex ) * 5 + cholesterolIndex
    var riskLevel = riskTable[index]
    callback('success','计算结果','患者10年患病风险: ' + riskLevel + '%')
}

export default caculateScoreModel