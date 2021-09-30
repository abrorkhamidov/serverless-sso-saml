import validate from "validate.js/validate";

// Models
import ResponseModel from "../models/response.model";

// Interfaces
import { IGeneric } from "../interfaces/generic.interface";

/**
 * Validate values against constraints
 * @param values
 * @param constraints
 * @return {Promise<*>}
 */
export const validateAgainstConstraints = (
  values: IGeneric<string,unknown>,
  constraints: IGeneric<string,unknown>
) => {
  return new Promise<void>((resolve, reject) => {
    const validation = validate(values, constraints);
    if (typeof validation === "undefined") {
      resolve();
    } else {
      reject(
        new ResponseModel({ validation }, 400, "required fields are missing")
      );
    }
  });
};

/**
 * Function to split array of data
 * into small chunks
 * @param data
 * @param chunkSize
 */
export const createChunks = async (data: any[], chunkSize: number) => {
  const urlChunks = [];
  let batchIterator = 0;
  while (batchIterator < data.length) {
    urlChunks.push(data.slice(batchIterator, (batchIterator += chunkSize)));
  }
  return urlChunks;
};

export const createFilterObject = async (filter_query: string,type: string) => {
  if (filter_query == "") {
    return null;
  } else {
    const values = filter_query.split(",");
    const filter_object = {};
    let index = 0;
    values.forEach(function (value) {
      index++;
      const object_key = ":" + type + "value" + index;
      filter_object[object_key.toString()] = value;
    });
    return filter_object
  }
}

export const createFilterExpressionString = async (type,vendor,product,version) => {
  let resultString = ""
  resultString = type !== null ? resultString + ` and #type IN (${Object.keys(type).toString()})` : resultString + "";
  resultString = vendor !== null ? resultString + ` and vendor IN (${Object.keys(vendor).toString()})` : resultString + "";
  resultString = product !== null ? resultString + ` and product IN (${Object.keys(product).toString()})` : resultString + "";
  resultString = version !== null ? resultString + ` and version IN (${Object.keys(version).toString()})` : resultString + "";
  return resultString
}

export const isEmpty = (obj) => {
  return Object.keys(obj).length == 0;
}
export function printShortDate(ms) {
    const date = new Date(ms);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return year
        + '.' + pref(month)
        + '.' + pref(day);

    function pref(number) {
        return (number < 10) ? '0' + number : number;
    }
}

export function printTotalPeriod(from,to) {
    return printShortDate(from) + ' - ' + printShortDate(to);
}

export function updateBookingObject(booking) {
  if (booking.startDate <= new Date().getTime()) {
        return {...booking, status: "CREATING"}
  } else {
        return {...booking, status: "FUTURE"}
    }
}


