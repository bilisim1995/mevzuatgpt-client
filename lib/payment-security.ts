// Ödeme güvenlik kontrolleri
export interface SecurityCheckResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  riskScore: number // 0-100 (0 = güvenli, 100 = yüksek risk)
}

// Luhn algoritması ile kart numarası doğrulama
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(cleaned)) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// CVV doğrulama
export function validateCVV(cvv: string, cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  // Visa, Mastercard, Discover: 3 haneli
  if (['4', '5'].includes(cleaned[0]) || cleaned.startsWith('6')) {
    return /^\d{3}$/.test(cvv)
  }
  
  // American Express: 4 haneli
  if (cleaned.startsWith('3')) {
    return /^\d{4}$/.test(cvv)
  }
  
  return /^\d{3,4}$/.test(cvv)
}

// Son kullanma tarihi kontrolü
export function validateExpiryDate(month: string, year: string): boolean {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  const expMonth = parseInt(month)
  const expYear = parseInt(year)
  
  if (expMonth < 1 || expMonth > 12) return false
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false
  if (expYear > currentYear + 20) return false // 20 yıl sonrası şüpheli
  
  return true
}

// BIN kontrolü ve banka tespiti
export function getCardInfo(cardNumber: string): { type: string; bank: string; isTest: boolean } {
  const cleaned = cardNumber.replace(/\s/g, '')
  const bin = cleaned.substring(0, 6)
  
  // Test kartları - İyzico sandbox test kartları
  const testBins = ['552879', '454671', '555544', '411111', '400000', '424242', '400005', '555555', '222300', '378282', '601111']
  const isTest = testBins.some(testBin => cleaned.startsWith(testBin))
  
  // Türk bankaları BIN listesi - Kapsamlı veri
  const bankBins: { [key: string]: string } = {
    // AKBANK T.A.S.
    '435509': 'Akbank', '413252': 'Akbank', '432072': 'Akbank', '557113': 'Akbank',
    '512754': 'Akbank', '524347': 'Akbank', '474854': 'Akbank', '589004': 'Akbank',
    '516840': 'Akbank', '516841': 'Akbank', '493837': 'Akbank', '425669': 'Akbank',
    '432071': 'Akbank', '435508': 'Akbank', '474853': 'Akbank', '520932': 'Akbank',
    '521807': 'Akbank', '521942': 'Akbank', '542110': 'Akbank', '552608': 'Akbank',
    '552609': 'Akbank', '553056': 'Akbank', '557829': 'Akbank', '535280': 'Akbank',
    '979206': 'Akbank', '979208': 'Akbank', '979207': 'Akbank', '550383': 'Akbank',
    '479680': 'Akbank', '479681': 'Akbank', '534253': 'Akbank', '535449': 'Akbank',
    
    // AKTIF YATIRIM BANKASI
    '453144': 'Aktif Yatırım', '581877': 'Aktif Yatırım', '671121': 'Aktif Yatırım',
    '535843': 'Aktif Yatırım', '532813': 'Aktif Yatırım', '453147': 'Aktif Yatırım',
    '504166': 'Aktif Yatırım', '453145': 'Aktif Yatırım', '453146': 'Aktif Yatırım',
    '453148': 'Aktif Yatırım', '453149': 'Aktif Yatırım', '500000': 'Aktif Yatırım',
    '528246': 'Aktif Yatırım', '534563': 'Aktif Yatırım', '671155': 'Aktif Yatırım',
    '979213': 'Aktif Yatırım', '517343': 'Aktif Yatırım', '534567': 'Aktif Yatırım',
    '515456': 'Aktif Yatırım',
    
    // ALBARAKA TURK
    '432284': 'Albaraka Turk', '547234': 'Albaraka Turk', '677397': 'Albaraka Turk',
    '511583': 'Albaraka Turk', '417715': 'Albaraka Turk', '417716': 'Albaraka Turk',
    '432285': 'Albaraka Turk', '534264': 'Albaraka Turk', '548232': 'Albaraka Turk',
    '627510': 'Albaraka Turk', '424935': 'Albaraka Turk', '979226': 'Albaraka Turk',
    '979227': 'Albaraka Turk', '479671': 'Albaraka Turk', '533973': 'Albaraka Turk',
    '434572': 'Albaraka Turk', '423002': 'Albaraka Turk', '533796': 'Albaraka Turk',
    
    // ALTERNATIFBANK
    '466281': 'Alternatifbank', '466284': 'Alternatifbank', '558485': 'Alternatifbank',
    '670670': 'Alternatifbank', '466280': 'Alternatifbank', '466282': 'Alternatifbank',
    '466283': 'Alternatifbank', '500001': 'Alternatifbank', '516308': 'Alternatifbank',
    '516458': 'Alternatifbank', '522221': 'Alternatifbank', '544836': 'Alternatifbank',
    '627768': 'Alternatifbank', '516657': 'Alternatifbank', '416394': 'Alternatifbank',
    '512618': 'Alternatifbank', '979228': 'Alternatifbank', '654997': 'Alternatifbank',
    '366579': 'Alternatifbank', '365771': 'Alternatifbank', '365772': 'Alternatifbank',
    '365773': 'Alternatifbank',
    
    // ANADOLUBANK
    '425848': 'Anadolubank', '441341': 'Anadolubank', '554301': 'Anadolubank',
    '676460': 'Anadolubank', '535881': 'Anadolubank', '425846': 'Anadolubank',
    '425847': 'Anadolubank', '425849': 'Anadolubank', '522240': 'Anadolubank',
    '522241': 'Anadolubank', '558593': 'Anadolubank', '603072': 'Anadolubank',
    '979240': 'Anadolubank',
    
    // ASYA FINANS
    '402280': 'Asya Finans', '477206': 'Asya Finans', '407381': 'Asya Finans',
    '527585': 'Asya Finans', '533149': 'Asya Finans', '627462': 'Asya Finans',
    '979232': 'Asya Finans', '402275': 'Asya Finans', '402276': 'Asya Finans',
    '407112': 'Asya Finans', '416987': 'Asya Finans', '441033': 'Asya Finans',
    '515849': 'Asya Finans', '524384': 'Asya Finans', '529462': 'Asya Finans',
    '531334': 'Asya Finans', '547799': 'Asya Finans', '552529': 'Asya Finans',
    '677131': 'Asya Finans',
    
    // BURGAN BANK
    '548434': 'Burgan Bank', '498518': 'Burgan Bank', '498521': 'Burgan Bank',
    '414941': 'Burgan Bank', '554034': 'Burgan Bank', '424407': 'Burgan Bank',
    '483013': 'Burgan Bank', '491373': 'Burgan Bank', '491374': 'Burgan Bank',
    '498516': 'Burgan Bank', '498517': 'Burgan Bank', '498519': 'Burgan Bank',
    '498520': 'Burgan Bank', '523759': 'Burgan Bank', '543943': 'Burgan Bank',
    '543944': 'Burgan Bank', '545863': 'Burgan Bank', '547680': 'Burgan Bank',
    '548202': 'Burgan Bank', '558379': 'Burgan Bank', '589298': 'Burgan Bank',
    
    // CITIBANK
    '471509': 'Citibank', '555087': 'Citibank', '437897': 'Citibank',
    '547712': 'Citibank', '553493': 'Citibank',
    
    // DENIZBANK
    '426391': 'Denizbank', '450051': 'Denizbank', '521376': 'Denizbank',
    '544127': 'Denizbank', '549220': 'Denizbank', '462448': 'Denizbank',
    '522517': 'Denizbank', '529876': 'Denizbank', '516914': 'Denizbank',
    '523515': 'Denizbank', '460345': 'Denizbank', '409070': 'Denizbank',
    '424360': 'Denizbank', '489458': 'Denizbank', '465574': 'Denizbank',
    '483747': 'Denizbank', '543427': 'Denizbank', '554483': 'Denizbank',
    '510119': 'Denizbank', '520303': 'Denizbank', '512117': 'Denizbank',
    '558448': 'Denizbank', '670610': 'Denizbank', '516740': 'Denizbank',
    '544445': 'Denizbank', '472915': 'Denizbank', '462449': 'Denizbank',
    '113134': 'Denizbank', '543358': 'Denizbank', '543400': 'Denizbank',
    '544460': 'Denizbank', '546764': 'Denizbank', '547161': 'Denizbank',
    '552679': 'Denizbank', '558443': 'Denizbank', '558446': 'Denizbank',
    '558460': 'Denizbank', '558514': 'Denizbank', '601912': 'Denizbank',
    '979220': 'Denizbank', '113336': 'Denizbank', '403134': 'Denizbank',
    '408625': 'Denizbank', '411924': 'Denizbank', '423667': 'Denizbank',
    '424361': 'Denizbank', '426392': 'Denizbank', '441139': 'Denizbank',
    '450050': 'Denizbank', '460346': 'Denizbank', '460347': 'Denizbank',
    '462276': 'Denizbank', '472914': 'Denizbank', '476662': 'Denizbank',
    '489456': 'Denizbank', '489457': 'Denizbank', '508129': 'Denizbank',
    '510063': 'Denizbank', '510118': 'Denizbank', '512017': 'Denizbank',
    '514924': 'Denizbank', '516731': 'Denizbank', '517047': 'Denizbank',
    '520019': 'Denizbank', '529545': 'Denizbank', '530597': 'Denizbank',
    '531245': 'Denizbank', '533330': 'Denizbank', '549839': 'Denizbank',
    
    // FIBABANKA
    '522576': 'Fibabanka', '517601': 'Fibabanka', '468973': 'Fibabanka',
    '534913': 'Fibabanka', '543624': 'Fibabanka', '518679': 'Fibabanka',
    '603343': 'Fibabanka', '522075': 'Fibabanka', '522566': 'Fibabanka',
    '527765': 'Fibabanka', '559056': 'Fibabanka', '979225': 'Fibabanka',
    
    // QNB BANK
    '677238': 'QNB Bank', '516835': 'QNB Bank', '402277': 'QNB Bank',
    '415565': 'QNB Bank', '422376': 'QNB Bank', '427311': 'QNB Bank',
    '435653': 'QNB Bank', '410147': 'QNB Bank', '444029': 'QNB Bank',
    '403082': 'QNB Bank', '499851': 'QNB Bank', '545120': 'QNB Bank',
    '519324': 'QNB Bank', '547567': 'QNB Bank', '529572': 'QNB Bank',
    '402278': 'QNB Bank', '402563': 'QNB Bank', '406386': 'QNB Bank',
    '409364': 'QNB Bank', '413583': 'QNB Bank', '414388': 'QNB Bank',
    '415956': 'QNB Bank', '420092': 'QNB Bank', '423277': 'QNB Bank',
    '423398': 'QNB Bank', '431379': 'QNB Bank', '441007': 'QNB Bank',
    '442395': 'QNB Bank', '459333': 'QNB Bank', '498749': 'QNB Bank',
    '499850': 'QNB Bank', '499852': 'QNB Bank', '499853': 'QNB Bank',
    '521022': 'QNB Bank', '521836': 'QNB Bank', '530818': 'QNB Bank',
    '531157': 'QNB Bank', '542404': 'QNB Bank', '545616': 'QNB Bank',
    '545847': 'QNB Bank', '547800': 'QNB Bank', '601050': 'QNB Bank',
    '479679': 'QNB Bank', '526911': 'QNB Bank', '401072': 'QNB Bank',
    '979202': 'QNB Bank', '979203': 'QNB Bank',
    
    // HSBC
    '405917': 'HSBC', '422629': 'HSBC', '496019': 'HSBC', '408969': 'HSBC',
    '550473': 'HSBC', '525413': 'HSBC', '556031': 'HSBC', '545183': 'HSBC',
    '519399': 'HSBC', '525795': 'HSBC', '512651': 'HSBC', '540643': 'HSBC',
    '676401': 'HSBC', '521045': 'HSBC', '556665': 'HSBC', '677193': 'HSBC',
    '405903': 'HSBC', '405913': 'HSBC', '405918': 'HSBC', '405919': 'HSBC',
    '409071': 'HSBC', '424909': 'HSBC', '428240': 'HSBC', '510005': 'HSBC',
    '522054': 'HSBC', '542254': 'HSBC', '550472': 'HSBC', '552143': 'HSBC',
    '556030': 'HSBC', '556033': 'HSBC', '556034': 'HSBC', '979214': 'HSBC',
    
    // ING BANK
    '455571': 'ING Bank', '490806': 'ING Bank', '408579': 'ING Bank',
    '420322': 'ING Bank', '400684': 'ING Bank', '542605': 'ING Bank',
    '510151': 'ING Bank', '547765': 'ING Bank', '554570': 'ING Bank',
    '526975': 'ING Bank', '535137': 'ING Bank', '676402': 'ING Bank',
    '408581': 'ING Bank', '414070': 'ING Bank', '420323': 'ING Bank',
    '420324': 'ING Bank', '480296': 'ING Bank', '490805': 'ING Bank',
    '490807': 'ING Bank', '490808': 'ING Bank', '526973': 'ING Bank',
    '532443': 'ING Bank', '540024': 'ING Bank', '540025': 'ING Bank',
    '542029': 'ING Bank', '542965': 'ING Bank', '542967': 'ING Bank',
    '548819': 'ING Bank', '550074': 'ING Bank', '554297': 'ING Bank',
    '603322': 'ING Bank', '676366': 'ING Bank', '514140': 'ING Bank',
    '979224': 'ING Bank', '479632': 'ING Bank', '479633': 'ING Bank',
    '517946': 'ING Bank', '979242': 'ING Bank', '531401': 'ING Bank',
    '550478': 'ING Bank',
    
    // KUVEYT TURK
    '402590': 'Kuveyt Türk', '403360': 'Kuveyt Türk', '410556': 'Kuveyt Türk',
    '518896': 'Kuveyt Türk', '547564': 'Kuveyt Türk', '402589': 'Kuveyt Türk',
    '402591': 'Kuveyt Türk', '402592': 'Kuveyt Türk', '403810': 'Kuveyt Türk',
    '410555': 'Kuveyt Türk', '424487': 'Kuveyt Türk', '431024': 'Kuveyt Türk',
    '511660': 'Kuveyt Türk', '512595': 'Kuveyt Türk', '520180': 'Kuveyt Türk',
    '525312': 'Kuveyt Türk', '677055': 'Kuveyt Türk', '527083': 'Kuveyt Türk',
    '979216': 'Kuveyt Türk', '483714': 'Kuveyt Türk', '483673': 'Kuveyt Türk',
    '483674': 'Kuveyt Türk',
    
    // ODEABANK
    '535446': 'Odeabank', '979219': 'Odeabank',
    
    // PAPARA
    '531389': 'Papara', '535925': 'Papara',
    
    // PROVUS
    '521584': 'Provus', '474823': 'Provus', '515865': 'Provus',
    '554566': 'Provus', '516742': 'Provus', '528825': 'Provus',
    '359000': 'Provus', '404990': 'Provus', '492192': 'Provus',
    '512446': 'Provus', '515755': 'Provus', '515895': 'Provus',
    '520909': 'Provus', '528823': 'Provus', '533293': 'Provus',
    '539605': 'Provus', '549938': 'Provus', '677047': 'Provus',
    
    // PTT ODEME
    '979277': 'PTT Ödeme',
    
    // SEKERBANK
    '494064': 'Şekerbank', '411157': 'Şekerbank', '423833': 'Şekerbank',
    '459068': 'Şekerbank', '521827': 'Şekerbank', '547311': 'Şekerbank',
    '676832': 'Şekerbank', '527657': 'Şekerbank', '459268': 'Şekerbank',
    '411159': 'Şekerbank', '411160': 'Şekerbank', '433383': 'Şekerbank',
    '433384': 'Şekerbank', '489401': 'Şekerbank', '494063': 'Şekerbank',
    '521394': 'Şekerbank', '525404': 'Şekerbank', '530866': 'Şekerbank',
    '539703': 'Şekerbank', '549208': 'Şekerbank', '549394': 'Şekerbank',
    '589713': 'Şekerbank', '516846': 'Şekerbank', '403836': 'Şekerbank',
    '409622': 'Şekerbank', '519753': 'Şekerbank', '411156': 'Şekerbank',
    '411158': 'Şekerbank', '421086': 'Şekerbank', '979211': 'Şekerbank',
    '510010': 'Şekerbank',
    
    // GARANTI BBVA
    '461668': 'Garanti BBVA', '474151': 'Garanti BBVA', '405090': 'Garanti BBVA',
    '426889': 'Garanti BBVA', '409219': 'Garanti BBVA', '420556': 'Garanti BBVA',
    '420557': 'Garanti BBVA', '542030': 'Garanti BBVA', '545102': 'Garanti BBVA',
    '557023': 'Garanti BBVA', '558699': 'Garanti BBVA', '540669': 'Garanti BBVA',
    '521825': 'Garanti BBVA', '520988': 'Garanti BBVA', '528939': 'Garanti BBVA',
    '553130': 'Garanti BBVA', '534261': 'Garanti BBVA', '520097': 'Garanti BBVA',
    '540118': 'Garanti BBVA', '524659': 'Garanti BBVA', '676255': 'Garanti BBVA',
    '676827': 'Garanti BBVA', '517042': 'Garanti BBVA', '516961': 'Garanti BBVA',
    '492186': 'Garanti BBVA', '493845': 'Garanti BBVA', '427315': 'Garanti BBVA',
    '403666': 'Garanti BBVA', '487075': 'Garanti BBVA', '432154': 'Garanti BBVA',
    '426887': 'Garanti BBVA', '482489': 'Garanti BBVA', '482491': 'Garanti BBVA',
    '410141': 'Garanti BBVA', '401738': 'Garanti BBVA', '403280': 'Garanti BBVA',
    '404308': 'Garanti BBVA', '405051': 'Garanti BBVA', '413836': 'Garanti BBVA',
    '426886': 'Garanti BBVA', '426888': 'Garanti BBVA', '427314': 'Garanti BBVA',
    '428220': 'Garanti BBVA', '428221': 'Garanti BBVA', '428967': 'Garanti BBVA',
    '428968': 'Garanti BBVA', '448472': 'Garanti BBVA', '462274': 'Garanti BBVA',
    '467293': 'Garanti BBVA', '467294': 'Garanti BBVA', '467295': 'Garanti BBVA',
    '482490': 'Garanti BBVA', '486567': 'Garanti BBVA', '487074': 'Garanti BBVA',
    '489455': 'Garanti BBVA', '489478': 'Garanti BBVA', '490175': 'Garanti BBVA',
    '492187': 'Garanti BBVA', '492193': 'Garanti BBVA', '514915': 'Garanti BBVA',
    '516943': 'Garanti BBVA', '517040': 'Garanti BBVA', '517041': 'Garanti BBVA',
    '517048': 'Garanti BBVA', '517049': 'Garanti BBVA', '520922': 'Garanti BBVA',
    '520940': 'Garanti BBVA', '521368': 'Garanti BBVA', '521824': 'Garanti BBVA',
    '521832': 'Garanti BBVA', '522204': 'Garanti BBVA', '526955': 'Garanti BBVA',
    '528956': 'Garanti BBVA', '533169': 'Garanti BBVA', '540036': 'Garanti BBVA',
    '540037': 'Garanti BBVA', '540226': 'Garanti BBVA', '540227': 'Garanti BBVA',
    '540709': 'Garanti BBVA', '541865': 'Garanti BBVA', '543738': 'Garanti BBVA',
    '544078': 'Garanti BBVA', '546001': 'Garanti BBVA', '547302': 'Garanti BBVA',
    '548935': 'Garanti BBVA', '552095': 'Garanti BBVA', '554796': 'Garanti BBVA',
    '554960': 'Garanti BBVA', '557945': 'Garanti BBVA', '589318': 'Garanti BBVA',
    '670606': 'Garanti BBVA', '676283': 'Garanti BBVA', '676651': 'Garanti BBVA',
    '535429': 'Garanti BBVA', '554253': 'Garanti BBVA', '554254': 'Garanti BBVA',
    '998802': 'Garanti BBVA', '601911': 'Garanti BBVA', '603004': 'Garanti BBVA',
    '603071': 'Garanti BBVA', '603124': 'Garanti BBVA', '603321': 'Garanti BBVA',
    '603342': 'Garanti BBVA', '603708': 'Garanti BBVA', '627160': 'Garanti BBVA',
    '627461': 'Garanti BBVA', '627509': 'Garanti BBVA', '627767': 'Garanti BBVA',
    '629440': 'Garanti BBVA', '638888': 'Garanti BBVA', '685800': 'Garanti BBVA',
    '690759': 'Garanti BBVA', '911199': 'Garanti BBVA', '940074': 'Garanti BBVA',
    '955999': 'Garanti BBVA', '979199': 'Garanti BBVA', '349999': 'Garanti BBVA',
    '374420': 'Garanti BBVA', '374421': 'Garanti BBVA', '374422': 'Garanti BBVA',
    '374423': 'Garanti BBVA', '374424': 'Garanti BBVA', '374425': 'Garanti BBVA',
    '374426': 'Garanti BBVA', '374427': 'Garanti BBVA', '375621': 'Garanti BBVA',
    '375622': 'Garanti BBVA', '375623': 'Garanti BBVA', '375624': 'Garanti BBVA',
    '375625': 'Garanti BBVA', '375626': 'Garanti BBVA', '375627': 'Garanti BBVA',
    '375628': 'Garanti BBVA', '375629': 'Garanti BBVA', '375630': 'Garanti BBVA',
    '375631': 'Garanti BBVA', '377136': 'Garanti BBVA', '377137': 'Garanti BBVA',
    '379999': 'Garanti BBVA', '479660': 'Garanti BBVA', '479661': 'Garanti BBVA',
    '479662': 'Garanti BBVA', '479682': 'Garanti BBVA', '535488': 'Garanti BBVA',
    '622402': 'Garanti BBVA', '979205': 'Garanti BBVA',
    
    // HALK BANKASI
    '498852': 'Halkbank', '415514': 'Halkbank', '552879': 'Halkbank',
    '521378': 'Halkbank', '447505': 'Halkbank', '415515': 'Halkbank',
    '421030': 'Halkbank', '676258': 'Halkbank', '526290': 'Halkbank',
    '420578': 'Halkbank', '440776': 'Halkbank', '492094': 'Halkbank',
    '492095': 'Halkbank', '498850': 'Halkbank', '498851': 'Halkbank',
    '499821': 'Halkbank', '510056': 'Halkbank', '510164': 'Halkbank',
    '526289': 'Halkbank', '540284': 'Halkbank', '540435': 'Halkbank',
    '543039': 'Halkbank', '543081': 'Halkbank', '588843': 'Halkbank',
    '639001': 'Halkbank', '451454': 'Halkbank', '979212': 'Halkbank',
    '113012': 'Halkbank', '589072': 'Halkbank', '979210': 'Halkbank',
    '979244': 'Halkbank', '466260': 'Halkbank', '537500': 'Halkbank',
    
    // IS BANKASI
    '450803': 'İş Bankası', '454358': 'İş Bankası', '418344': 'İş Bankası',
    '552096': 'İş Bankası', '510152': 'İş Bankası', '589283': 'İş Bankası',
    '441076': 'İş Bankası', '540667': 'İş Bankası', '113064': 'İş Bankası',
    '113334': 'İş Bankası', '418342': 'İş Bankası', '418343': 'İş Bankası',
    '418345': 'İş Bankası', '441075': 'İş Bankası', '441077': 'İş Bankası',
    '454314': 'İş Bankası', '454318': 'İş Bankası', '454359': 'İş Bankası',
    '454360': 'İş Bankası', '540668': 'İş Bankası', '543771': 'İş Bankası',
    '553058': 'İş Bankası', '603125': 'İş Bankası', '479610': 'İş Bankası',
    '548237': 'İş Bankası', '979204': 'İş Bankası', '483602': 'İş Bankası',
    '535514': 'İş Bankası', '979233': 'İş Bankası', '533803': 'İş Bankası',
    '537475': 'İş Bankası',
    
    // VAKIFLAR BANKASI
    '493840': 'Vakıflar Bankası', '411724': 'Vakıflar Bankası', '411944': 'Vakıflar Bankası',
    '416757': 'Vakıflar Bankası', '540046': 'Vakıflar Bankası', '542804': 'Vakıflar Bankası',
    '520017': 'Vakıflar Bankası', '554548': 'Vakıflar Bankası', '402940': 'Vakıflar Bankası',
    '409084': 'Vakıflar Bankası', '411942': 'Vakıflar Bankası', '411943': 'Vakıflar Bankası',
    '411979': 'Vakıflar Bankası', '415792': 'Vakıflar Bankası', '428945': 'Vakıflar Bankası',
    '442671': 'Vakıflar Bankası', '479909': 'Vakıflar Bankası', '491005': 'Vakıflar Bankası',
    '493841': 'Vakıflar Bankası', '493846': 'Vakıflar Bankası', '540045': 'Vakıflar Bankası',
    '542798': 'Vakıflar Bankası', '547244': 'Vakıflar Bankası', '552101': 'Vakıflar Bankası',
    '589311': 'Vakıflar Bankası', '479908': 'Vakıflar Bankası', '001599': 'Vakıflar Bankası',
    '113015': 'Vakıflar Bankası', '542119': 'Vakıflar Bankası', '979209': 'Vakıflar Bankası',
    '459252': 'Vakıflar Bankası', '650052': 'Vakıflar Bankası', '434530': 'Vakıflar Bankası',
    '423478': 'Vakıflar Bankası', '483612': 'Vakıflar Bankası', '535576': 'Vakıflar Bankası',
    '537504': 'Vakıflar Bankası',
    
    // ZIRAAT BANKASI
    '469884': 'Ziraat Bankası', '454671': 'Ziraat Bankası', '533154': 'Ziraat Bankası',
    '404591': 'Ziraat Bankası', '454672': 'Ziraat Bankası', '512440': 'Ziraat Bankası',
    '454673': 'Ziraat Bankası', '454674': 'Ziraat Bankası', '413226': 'Ziraat Bankası',
    '444676': 'Ziraat Bankası', '444677': 'Ziraat Bankası', '444678': 'Ziraat Bankası',
    '540134': 'Ziraat Bankası', '547287': 'Ziraat Bankası', '447504': 'Ziraat Bankası',
    '407814': 'Ziraat Bankası', '476619': 'Ziraat Bankası', '542374': 'Ziraat Bankası',
    '540130': 'Ziraat Bankası', '534981': 'Ziraat Bankası', '530905': 'Ziraat Bankası',
    '676123': 'Ziraat Bankası', '676124': 'Ziraat Bankası', '528208': 'Ziraat Bankası',
    '531102': 'Ziraat Bankası', '516932': 'Ziraat Bankası', '527682': 'Ziraat Bankası',
    '453955': 'Ziraat Bankası', '453956': 'Ziraat Bankası', '454894': 'Ziraat Bankası',
    '523529': 'Ziraat Bankası', '541001': 'Ziraat Bankası', '541033': 'Ziraat Bankası',
    '546957': 'Ziraat Bankası', '549449': 'Ziraat Bankası', '482465': 'Ziraat Bankası',
    '979217': 'Ziraat Bankası', '513662': 'Ziraat Bankası', '979280': 'Ziraat Bankası',
    
    // TEB
    '440293': 'TEB', '402459': 'TEB', '489495': 'TEB', '455645': 'TEB',
    '438040': 'TEB', '510138': 'TEB', '512803': 'TEB', '440274': 'TEB',
    '402142': 'TEB', '447503': 'TEB', '404315': 'TEB', '524839': 'TEB',
    '512753': 'TEB', '549998': 'TEB', '542259': 'TEB', '606329': 'TEB',
    '527026': 'TEB', '427707': 'TEB', '440295': 'TEB', '113032': 'TEB',
    '402299': 'TEB', '402458': 'TEB', '406015': 'TEB', '440247': 'TEB',
    '440273': 'TEB', '440294': 'TEB', '450918': 'TEB', '459026': 'TEB',
    '489494': 'TEB', '489496': 'TEB', '510139': 'TEB', '510221': 'TEB',
    '519780': 'TEB', '524346': 'TEB', '524840': 'TEB', '525314': 'TEB',
    '528920': 'TEB', '530853': 'TEB', '545124': 'TEB', '545148': 'TEB',
    '547985': 'TEB', '550449': 'TEB', '553090': 'TEB', '676406': 'TEB',
    '676578': 'TEB', '532581': 'TEB', '531531': 'TEB', '552207': 'TEB',
    '479227': 'TEB', '534538': 'TEB', '535217': 'TEB', '427308': 'TEB',
    '469188': 'TEB', '404350': 'TEB', '416350': 'TEB', '979223': 'TEB',
    '115032': 'TEB', '413528': 'TEB',
    
    // TEKSTILBANK
    '456057': 'Tekstilbank', '413729': 'Tekstilbank', '545770': 'Tekstilbank',
    '514025': 'Tekstilbank', '527080': 'Tekstilbank', '413972': 'Tekstilbank',
    '445988': 'Tekstilbank', '456059': 'Tekstilbank', '521875': 'Tekstilbank',
    '545769': 'Tekstilbank', '558634': 'Tekstilbank', '589416': 'Tekstilbank',
    '979239': 'Tekstilbank',
    
    // TURK ELEKTRONIK PARA
    '979235': 'Türk Elektronik Para', '979248': 'Türk Elektronik Para',
    
    // TURKISHBANK
    '518599': 'Turkishbank', '552098': 'Turkishbank', '589288': 'Turkishbank',
    '521594': 'Turkishbank', '419389': 'Turkishbank', '529939': 'Turkishbank',
    '677522': 'Turkishbank',
    
    // TURKLAND BANK
    '548375': 'Turklend Bank', '603005': 'Turklend Bank', '676429': 'Turklend Bank',
    '979231': 'Turklend Bank',
    
    // TURKIYE FINANS
    '400742': 'Türkiye Finans', '511758': 'Türkiye Finans', '435628': 'Türkiye Finans',
    '411685': 'Türkiye Finans', '521848': 'Türkiye Finans', '606043': 'Türkiye Finans',
    '485061': 'Türkiye Finans', '552610': 'Türkiye Finans', '459907': 'Türkiye Finans',
    '511783': 'Türkiye Finans', '441206': 'Türkiye Finans', '404952': 'Türkiye Finans',
    '424927': 'Türkiye Finans', '424931': 'Türkiye Finans', '428462': 'Türkiye Finans',
    '435627': 'Türkiye Finans', '435629': 'Türkiye Finans', '470954': 'Türkiye Finans',
    '479915': 'Türkiye Finans', '479916': 'Türkiye Finans', '479917': 'Türkiye Finans',
    '485060': 'Türkiye Finans', '498724': 'Türkiye Finans', '677451': 'Türkiye Finans',
    '498725': 'Türkiye Finans', '512360': 'Türkiye Finans', '528293': 'Türkiye Finans',
    '537719': 'Türkiye Finans', '549294': 'Türkiye Finans', '627161': 'Türkiye Finans',
    '416275': 'Türkiye Finans', '979218': 'Türkiye Finans',
    
    // VAKIF KATILIM
    '670544': 'Vakıf Katılım', '535355': 'Vakıf Katılım', '483703': 'Vakıf Katılım',
    '483704': 'Vakıf Katılım', '979230': 'Vakıf Katılım',
    
    // YAPI KREDI
    '479795': 'Yapı Kredi', '492130': 'Yapı Kredi', '455359': 'Yapı Kredi',
    '491205': 'Yapı Kredi', '413382': 'Yapı Kredi', '442106': 'Yapı Kredi',
    '540061': 'Yapı Kredi', '545103': 'Yapı Kredi', '540122': 'Yapı Kredi',
    '510054': 'Yapı Kredi', '603797': 'Yapı Kredi', '516888': 'Yapı Kredi',
    '401622': 'Yapı Kredi', '404809': 'Yapı Kredi', '414392': 'Yapı Kredi',
    '420342': 'Yapı Kredi', '446212': 'Yapı Kredi', '450634': 'Yapı Kredi',
    '476625': 'Yapı Kredi', '476626': 'Yapı Kredi', '477959': 'Yapı Kredi',
    '479794': 'Yapı Kredi', '490983': 'Yapı Kredi', '491206': 'Yapı Kredi',
    '492128': 'Yapı Kredi', '492131': 'Yapı Kredi', '494314': 'Yapı Kredi',
    '525864': 'Yapı Kredi', '533913': 'Yapı Kredi', '537833': 'Yapı Kredi',
    '540062': 'Yapı Kredi', '540063': 'Yapı Kredi', '540129': 'Yapı Kredi',
    '542117': 'Yapı Kredi', '552645': 'Yapı Kredi', '552659': 'Yapı Kredi',
    '554422': 'Yapı Kredi', '639004': 'Yapı Kredi', '676166': 'Yapı Kredi',
    '479620': 'Yapı Kredi', '479612': 'Yapı Kredi', '979215': 'Yapı Kredi',
    '420343': 'Yapı Kredi', '535601': 'Yapı Kredi', '535602': 'Yapı Kredi',
    '535435': 'Yapı Kredi', '537518': 'Yapı Kredi', '406281': 'Yapı Kredi',
    '657366': 'Yapı Kredi', '657998': 'Yapı Kredi', '979241': 'Yapı Kredi',
    
    // ZIRAAT KATILIM
    '416283': 'Ziraat Katılım', '670586': 'Ziraat Katılım', '539134': 'Ziraat Katılım',
    '979221': 'Ziraat Katılım',
    
    // Test kartları
    '411111': 'Test Visa', '400000': 'Test Visa', '555555': 'Test Mastercard',
    '378282': 'Test Amex', '601111': 'Test Discover', '424242': 'Test Visa',
    '400005': 'Test Visa', '222300': 'Test Mastercard'
  }
  
  // Kart türü tespiti
  let cardType = 'UNKNOWN'
  if (cleaned.startsWith('4')) {
    cardType = 'VISA'
  } else if (cleaned.startsWith('5') && (cleaned[1] >= '1' && cleaned[1] <= '5')) {
    cardType = 'MASTERCARD'
  } else if (cleaned.startsWith('3') && (cleaned[1] === '4' || cleaned[1] === '7')) {
    cardType = 'AMEX'
  } else if (cleaned.startsWith('6')) {
    cardType = 'DISCOVER'
  }
  
  // Banka tespiti
  let bank = 'Bilinmeyen'
  for (const [binPrefix, bankName] of Object.entries(bankBins)) {
    if (cleaned.startsWith(binPrefix)) {
      bank = bankName
      break
    }
  }
  
  
  return { type: cardType, bank, isTest }
}

// IP risk analizi
export function analyzeIPRisk(ip: string): { risk: number; country: string; isProxy: boolean } {
  // Basit IP analizi (gerçek uygulamada GeoIP servisi kullanılmalı)
  const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')
  const isPrivate = ip.startsWith('172.') || ip.startsWith('169.254.')
  
  let risk = 0
  let country = 'TR'
  let isProxy = false
  
  if (isLocalhost) {
    risk = 10 // Geliştirme ortamı
    country = 'TR'
  } else if (isPrivate) {
    risk = 20 // Özel ağ
  } else {
    // Gerçek IP analizi burada yapılabilir
    risk = 30 // Varsayılan risk
  }
  
  return { risk, country, isProxy }
}

// Şüpheli aktivite kontrolü
export function detectSuspiciousActivity(
  cardNumber: string,
  ip: string,
  amount: number,
  previousAttempts: number = 0
): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  // Çok fazla deneme
  if (previousAttempts > 3) {
    reasons.push('Çok fazla başarısız deneme')
  }
  
  // Yüksek tutar
  if (amount > 10000) {
    reasons.push('Yüksek tutar')
  }
  
  // Test kartı ile yüksek tutar
  const cardInfo = getCardInfo(cardNumber)
  if (cardInfo.isTest && amount > 1000) {
    reasons.push('Test kartı ile yüksek tutar')
  }
  
  // IP risk analizi
  const ipRisk = analyzeIPRisk(ip)
  if (ipRisk.risk > 50) {
    reasons.push('Yüksek risk IP adresi')
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons
  }
}

// Ana güvenlik kontrolü
export function performSecurityChecks(
  cardNumber: string,
  cvv: string,
  expiryMonth: string,
  expiryYear: string,
  ip: string,
  amount: number,
  previousAttempts: number = 0
): SecurityCheckResult {
  const errors: string[] = []
  const warnings: string[] = []
  let riskScore = 0
  
  // Kart numarası kontrolü
  if (!validateCardNumber(cardNumber)) {
    errors.push('Geçersiz kart numarası')
    riskScore += 30
  }
  
  // CVV kontrolü
  if (!validateCVV(cvv, cardNumber)) {
    errors.push('Geçersiz CVV')
    riskScore += 25
  }
  
  // Son kullanma tarihi kontrolü
  if (!validateExpiryDate(expiryMonth, expiryYear)) {
    errors.push('Geçersiz son kullanma tarihi')
    riskScore += 20
  }
  
  // BIN kontrolü
  const cardInfo = getCardInfo(cardNumber)
  if (cardInfo.type === 'UNKNOWN') {
    // Bilinmeyen kart türü uyarısı kaldırıldı
    riskScore += 10
  }
  
  if (cardInfo.isTest) {
    warnings.push('Test kartı kullanılıyor')
    riskScore += 5
  }
  
  // IP risk analizi
  const ipRisk = analyzeIPRisk(ip)
  riskScore += ipRisk.risk
  
  if (ipRisk.isProxy) {
    warnings.push('Proxy IP tespit edildi')
    riskScore += 15
  }
  
  // Şüpheli aktivite kontrolü
  const suspicious = detectSuspiciousActivity(cardNumber, ip, amount, previousAttempts)
  if (suspicious.isSuspicious) {
    warnings.push(...suspicious.reasons)
    riskScore += suspicious.reasons.length * 10
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    riskScore: Math.min(riskScore, 100)
  }
}
