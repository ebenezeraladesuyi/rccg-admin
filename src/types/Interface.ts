

export interface iGallery {
    rccgGallImage: string | File;
}

export interface iFirst {
    _id : string,
    name: string;
    address: string;
    county: string;
    occupation: string;
    telHome : string;
    telWork : string;
    mobile : string;
    email : string;
    visitOrStay : string;
    prayerRequest : string;
    haveJesus : string;
    pastorVisit : boolean;
}

export interface iBlog {
    blogImage : string | File;
    author: string;
    title: string;
    details: string;
    createdAt? : Date;
}
