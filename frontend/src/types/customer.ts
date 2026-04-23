export interface FormInputs {
  personalInfo: {
    name: string;
    phone: string;
    address: string;
    referralBy: string;
  };
  measurements: {
    male: {
      length: string;
      shoulder: string;
      sleeve: string;
      chest: string;
      waist: string;
      neck: string;
      daman: string;
      shalwarLength: string;
      pancha: string;
      extra?: {
        collarType: string;
        pocketStyle: string;
        cuffStyle: string;
        damanStyle: string;
        shalwarType: string;
      };
    };
    female: {
      top: { bust: string; underBust: string; waist: string; hips: string; shoulderToApex: string; armhole: string; sleeveLength: string; frontNeckDepth: string; backNeckDepth: string; };
      bottom: { highWaist: string; hips: string; fullLength: string; thigh: string; };
    };
  };
  orderDetails: {
    quantity: number;
    items: { colorCode: string; fabricNote: string; }[];
    totalPrice: string;
    dueDate: string;
    orderStatus: string;
    paymentStatus: boolean;
    advancePayment: string;
  };
}
