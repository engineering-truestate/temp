import type { Configuration } from 'algoliasearch'
import type { DocumentReference } from 'firebase/firestore'

export interface UserActivity {
    id: number
    user: string
    label: string
    action: string
    target: string
    time: number
    type: string
    status: string
    from: string
    to: string
    for: string
    note: string
    documents: string[]
    properties: string[]
    details: string
    price: string
    changes: string[]
    docName?: string
}

export interface User {
    added: number
    address: string
    agentId: string
    agentName: string
    alternateNumber: string
    auctionTigerPassword: string
    auctionTigerUsername: string
    aumForTe: number
    cashBack: number
    componentB: number
    componentW: number
    creditScore: number
    eAuctionPassword: string
    eAuctionUsername: string
    experience: number
    fDBonus: number
    goal: string
    gold: number
    inPersonMarketing: number
    invoiceRaised: string
    kpppPassword: string
    kpppUsername: string
    lastModified: number
    linkedinProfile: string
    loans?: any[]
    units?: any[]
    mail: string
    management: string
    name: string
    netWorth: number
    phoneNumber: string | null
    productType: string[]
    interest: string[]
    projectName: string
    properties?: any
    realEstate: number
    reasonForJoining: string
    referrals?: string[]
    riskType: string
    source: string
    status: string
    stocksMutualFund: number
    subSource: string
    tag: string
    tdsOfCashBack: string
    testimonial: string
    total: number
    truEstateSignUp: boolean
    uploadedAt: number
    userId: string
    whatsappGroup: string[]
    Activity?: UserActivity[]
    statusChange: statusChange[]
    pastAgents: pastAgents[]
    notes?: Note[]
    isKycDone?: boolean
}
export interface Loan {
    stage?: string
    loanId?: string
    projectId?: string
    projectName?: string
    selectedBank?: string
    loanPercentage?: number | null
    loanAmount?: number | null
    interestRate?: number | null
    tenure?: number | null
    added?: number | null
    lastModified?: number | null
}
export interface Unit {
    unitId: string
    assetType?: 'apartment' | 'plot' | 'villa' | 'independentHouse' | 'independentBuilding'

    directionOfEntrance?:
        | 'North'
        | 'South'
        | 'East'
        | 'West'
        | 'North-East'
        | 'North-West'
        | 'South-East'
        | 'South-West'
    unitNo?: string
    purchaseAmount?: number
    sbua?: string
    cornerUnit?: 'Yes' | 'No'
    projectId?: string
    projectName?: string

    // Apartment / Villa / Independent Building
    configuration?: '1BHK' | '2BHK' | '3BHK' | '4BHK' | '5BHK' | 'Studio'
    // Plot-specific
    plotArea?: string
    // Villa & Independent House & Independent Building
    landSize?: string

    // Independent House
    totalFloors?: string
    houseNo?: string
    added?: number
    lastModified?: number
    documents?: DocumentData[]
}

type DocumentData = {
    name: string
    downloadURL: string
    path: string
}

// interface CallLog {
//     agent: string
//     note: string
//     status?: string
//     callDuration: string
//     timestamp: number
//     connectedOn: number
// }

// interface projectShare {
//     agent: string
//     properties: string[]
//     timestamp: number
// }

// interface Requirement {
//     agent: string
//     details: string
//     timestamp: number
//     statusChange: statusChange[]
//     pastAgents: pastAgents[]
// }

export interface Task {
    taskId?: string // Firestore document ID
    actionType: string
    agentId: string
    agentName: string
    completedTimestamp: number
    added: number
    userName: string
    userPhoneNumber: string
    projectId: string
    schedule: number
    status: string
    taskName: string
    taskType: string | null
    userId: string
    propertyType: string
    notes: Note[]
    document?: string[]
    loanId?: string | null
    projectName?: string
}

// Task-specific interfaces extending base Task
export interface CollectEOITask extends Task {
    modeOfEOI?: string
    document?: string[]
}

export interface CollectEMDTask extends Task {
    modeOfEMD?: string
    document?: string[]
}

export interface LoanDiscussionTask extends Task {
    selectedBank?: string
    loanPercentage?: number
    loanAmount?: number
    interestRate?: number
}

export interface HelpInBiddingTask extends Task {
    result?: string
}

export interface CustomerKYCTask extends Task {
    document?: string[]
}

// Type aliases for tasks that only use base Task fields
export type PlanSiteVisitTask = Task
export type TDSPaymentTask = Task
export type LeadRegistrationTask = Task
export type OtherDiscussionTask = Task
export type EMDAmountReturnTask = Task
export type Confirm25PaymentTask = Task

export interface CreateSiteCredentialTask extends Task {
    platform?: string
    username?: string
    password?: string
}

export interface RaiseInvoiceTask extends Task {
    document?: string[]
}

export interface statusChange {
    timestamp: number
    agentName: string
    from: string
    to: string
}
export interface pastAgents {
    timestamp: number
    from: string
    to: string
}

export interface Note {
    timestamp: number
    agentName: string
    note: string | null
}
// Types
export interface Requirements {
    id: string
    maxBudget: number | null
    budgetForAuction: number | null
    budgetForPreLaunch: number | null
    budgetForExclusiveOpp: number | null
    productType: string | string[]
    strategy: string | string[]
    typeOfInvestment: string | string[]
    assetType: string | string[]
    floor: string | string[]
    facing: string | string[]
    projectType: string | string[]
    loan: string | string[]
    microMarket: string | string[]
    plotArea: number | null
    villaConfiguration?: string | null
    sbuaSize: number | null
    whenPlanning: string | string[]
    zone: string
    holdingPeriod: number | null
    loanPercent: number | null
    vastu: string | null
    apartmentConfiguration?: string | null
    preferredBuilderName: string[]
    auctionIds?: string[]
    preLaunchIds?: string[]
    notes: Note | null
    showTruestate: boolean
    fromTruestate: boolean
    added: number
    status?: string
}

export interface UserProperty {
    requirementIds: string[]
    projectId: string
    stage: string
    wishlisted: boolean
    modeOfEoi?: string
    modeOfEmd?: string
    agentName?: string
    added?: number
}

// Property Interface
export interface ProjectOverview {
    launchedPrice: number
    pricePerSqft: number
    stage: string
    availability: string
    zone: string
    // micromarket: string
    projectSize: number
    openArea: number
    totalUnits: number
    launchDate: number
    handOverDate: number
    projectDensity: number
    litigation: boolean
    ASLUProjectData: number
    ASLUProjectInvestment: number
}

export interface Facilities {
    coveredParking: number
    openParking: number
    totalTower: number
    waterSource: string
    metroConnectivity: string
}

export interface OtherData {
    reraNumber: string
    isReraApproved: boolean
}

export interface InvestmentOverview {
    cagr: number
    holdingPeriod: number
    value: string
    minInvestment: number
    growth: string
    estPrice: number
    xirr: number
    lastModified: number
}
export interface LocationAnalysis {
    location: string
    lat: number
    long: number
}

export interface Document {
    document: string
    documentType: string
    documentName: string
}

export type extraRoomDetails = 'serventRoom' | 'studyRoom' | 'maidRoom' | string

export interface ConfigurationDetails {
    sbua: number
    currentPrice: number
    available: boolean
    carpetArea: number
    extraRoomDetails: extraRoomDetails[]
}

export interface ConfigurationApartment {
    studio: ConfigurationDetails[]
    oneBHK: ConfigurationDetails[]
    oneBHKPlus: ConfigurationDetails[]
    twoBHK: ConfigurationDetails[]
    twoBHKPlus: ConfigurationDetails[]
    threeBHK: ConfigurationDetails[]
    threeBHKPlus: ConfigurationDetails[]
    fourBHK: ConfigurationDetails[]
    fourBHKPlus: ConfigurationDetails[]
    fiveBHK: ConfigurationDetails[]
    fiveBHKPlus: ConfigurationDetails[]
    sixBHK: ConfigurationDetails[]
}

export interface ConfigurationPlot {
    plotArea: number
    pricePerSqft: number
}

export interface ConfigurationVilla<T extends 'uds' | 'landRegistration'> {
    plotArea: number
    pricePerSqft: number
    landholdingType: T
    landDetails: T extends 'uds' ? VillaUDS : VillaLand
}

export interface VillaUDS {
    carpetArea: number
    sbua: number
}

export interface VillaLand {
    landArea: number
    sbua: number
}

export type AssetType<T extends string = 'apartment' | 'villa' | 'plot'> = {
    assetType: T
    configuration: T extends 'apartment'
        ? ConfigurationApartment
        : T extends 'villa'
          ? ConfigurationVilla<T extends 'villa' ? 'uds' : 'landRegistration'>
          : T extends 'plot'
            ? ConfigurationPlot[]
            : null
}

export interface Lead {
    projectId: string
    name: string
    agentName: string
    phoneNumber: string
    status: string
    stage: string
    lastModified: number
    Task: any
    Source: string
}

export interface priceHistory {
    previousPricePerSqft: number
    priceChangeDate: number
    agentName: string
    agentId: string
    agentIcon: string
    newPricePerSqft: number
}

export interface availabilityHistory {
    previousAvailability: string
    priceChangeDate: number
    agentName: string
    agentId: string
    agentIcon: string
    newAvailability: string
}

export interface cagrHistory {
    previousCagr: number
    priceChangeDate: number
    agentName: string
    agentId: string
    agentIcon: string
    newCagr: number
}

export interface valueHistory {
    previousValue: string
    priceChangeDate: number
    agentName: string
    agentId: string
    agentIcon: string
    newValue: string
}

export interface Property<T extends string = 'apartment' | 'villa' | 'plot'> {
    truEstimate: number
    projectOverview: ProjectOverview
    facilities: Facilities
    otherData: OtherData
    investmentOverview: InvestmentOverview
    leads: Lead[]
    tasks: DocumentReference[]
    Amenities: string[]
    configurationDetails: Configuration
    locationAnalysis: LocationAnalysis
    documents: Document[]
    feedback: string
    images: string[]

    priceHistory: priceHistory[]

    availabilityHistory: availabilityHistory[]

    cagrHistory: cagrHistory[]

    valueHistory: valueHistory[]

    projectId: string

    devTier: string

    projectName: string
    ic: number // interested customer
    assetType: T
    zone: string
    micromarket: string
    pricePerSqft: number
    price: number
    handoverDate: number
    sbua: number
    configuration: T extends 'apartment'
        ? ConfigurationApartment
        : T extends 'villa'
          ? ConfigurationVilla<T extends 'villa' ? 'uds' : 'landRegistration'>[]
          : T extends 'plot'
            ? ConfigurationPlot[]
            : null
    builder: string
    totalUnits: number
    projectSize: number

    // for internal use
    lastModified: number
    added: number
    showOnTruEstate: boolean
    recommended: boolean
}

// Auction Property
export interface alternateAgents {
    agentName: string
    agentPhone: string
}
export interface AuctionOverview {
    auctionType: string
    bankType: string
    auctionCAGR: string
    khataType: string
    auctionValue: string[]
    auctionStatus: 'open' | 'upcoming' | 'closed' | string
    exitRisk: string
    url: string
    auctionDate: number
    emdSubmissionDate: number
    reservedPrice: string
    loanEligiblity: string
    bankName: string
    stage: string

    buildingArea?: string | number
    propertyArea?: string | number
    reasonForRejection?: string
    sourceInternalId: string

    agentName: string
    agentPhone: string
    additionalInfo: string
    extraInfo: string
    riskInfo: string
    alternateAgents?: alternateAgents[]
}

export interface VerificationStatus {
    legalVerificationStatus: 'issue' | 'clear' | string
    localityCheckStatus: 'issue' | 'clear' | string
    constructionQualityStatus: 'issue' | 'clear' | string
    detailsFromBanks: 'in progress' | 'collected' | string
    duesCheck: 'in progress' | 'completed' | string
    readyForAuction: 'yes' | 'no' | string
}

export interface auctionUnitDetails<
    T extends string = 'apartment' | 'villa' | 'plot' | 'independent building' | 'independent house',
    P extends 'residential' | 'commercial' = 'residential' | 'commercial',
> {
    allInclusivePrice: number
    cagr: number
    currentPricePerSqft: number
    currentValue: number
    stage: string
    formattedReservePrice?: string
    damagesRenovationCost: number
    maintainsDue: number
    costToBuilder: number
    demolitionCost: number

    emdPrice: number
    estSellingPriceSqft: number
    furnished: string
    holdingPeriodYears: number
    interestOfBuyer: string
    litigation: string

    maxBidPrice: number
    micromarketGrowth: number
    url: string
    ownerName: string
    possession: string

    rentalYield: number
    truEstimatePrice: number
    reservePrice: number

    minInvestment: number
    totalSeats: number
    seatsFilled: number
    lastDate: number

    strategy: string[]
    units: number

    configuration: T extends 'plot' ? never : string

    sbua: P extends 'commercial'
        ? never
        : T extends 'apartment' | 'independent building' | 'independent house'
          ? number
          : never

    carpetArea: P extends 'commercial'
        ? number
        : T extends 'apartment' | 'independent building' | 'independent house'
          ? number
          : never

    floor: P extends 'commercial'
        ? never
        : T extends 'apartment' | 'independent building' | 'independent house'
          ? number
          : never

    plotArea: P extends 'commercial' ? never : T extends 'villa' | 'plot' | 'independent house' ? number : never

    uds: P extends 'commercial' ? never : T extends 'villa' | 'independent house' | 'apartment' ? number : never

    totalFloors: P extends 'commercial' ? number : T extends 'villa' | 'independent house' ? number : never
}

export interface DuplicateCheckResult {
    duplicate: boolean
    originalDoc?: { id: string } | null
}

export interface AuctionProperty<
    T extends string = 'apartment' | 'villa' | 'plot' | 'independent building' | 'independent house',
> {
    auctionOverview: AuctionOverview
    verificationStatus: VerificationStatus
    url: string

    truRecommended: boolean
    truVerified: boolean
    truPotential: 'potential' | 'hold' | 'rejected' | 'not checked' | string
    showOnTruEstate: boolean
    forLLP: boolean
    images: string[]

    assetType: T

    micromarket: string
    zone: string
    projectName: string
    projectId: string
    builderName: string
    projectType: 'residential' | 'commercial'
    commercialType?: 'shop' | 'office' | 'warehouse' | 'plot' | 'industrial space' | 'other' | null

    minInvestmentOfAuction: number
    maxAuctionCAGR: number
    auctionReservePrice: number
    expectedAuctionReturn: number

    auctionNotice: string

    leads: DocumentReference[]
    tasks: DocumentReference[]

    amenities: string[]
    unitDetails: auctionUnitDetails<T, this['projectType']>[]

    locationAnalysis: LocationAnalysis
    documents: Document[]

    duplicateResult?: DuplicateCheckResult[]
    duplicateAuction?: DocumentReference[]

    lastModified: number
    added: number
}
