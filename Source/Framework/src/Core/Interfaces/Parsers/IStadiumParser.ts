import { Stadium } from "../../Models/Stadium/Stadium";
import { IParser } from "./IParser";

/**
 * Defines stadium parser functionality.
 * @type {TStadium} The type of stadium to parse.
 */
export interface IStadiumParser<TStadium extends Stadium> extends IParser<TStadium> {

}