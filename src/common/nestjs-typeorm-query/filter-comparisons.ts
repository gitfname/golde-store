
import { BooleanFieldComparisons, CommonFieldComparisonBetweenType, CommonFieldComparisonType, Filter, StringFieldComparisons } from "@ptc-org/nestjs-query-core"
import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger"


class DateFieldComparisonsBetweenDto implements CommonFieldComparisonBetweenType<Date> {
    @ApiProperty({ name: "lower", type: Date })
    lower: Date;

    @ApiProperty({ name: "upper", type: Date })
    upper: Date;
}

export class DateFieldComparisonsDto implements CommonFieldComparisonType<Date> {
    @ApiPropertyOptional({ name: "is", enum: [false, true, null] })
    is?: boolean;

    @ApiPropertyOptional({ name: "isNot", enum: [false, true, null] })
    isNot?: boolean;

    @ApiPropertyOptional({ name: "eq", type: Date })
    eq?: Date;

    @ApiPropertyOptional({ name: "neq", type: Date })
    neq?: Date;

    @ApiPropertyOptional({ name: "gt", type: Date })
    gt?: Date;

    @ApiPropertyOptional({ name: "gte", type: Date })
    gte?: Date;

    @ApiPropertyOptional({ name: "lt", type: Date })
    lt?: Date;

    @ApiPropertyOptional({ name: "lte", type: Date })
    lte?: Date;

    @ApiPropertyOptional({ name: "between", type: DateFieldComparisonsBetweenDto })
    between?: DateFieldComparisonsBetweenDto;

    @ApiPropertyOptional({ name: "notBetween", type: DateFieldComparisonsBetweenDto })
    notBetween?: DateFieldComparisonsBetweenDto;

    @ApiPropertyOptional({ name: "in", type: Date, isArray: true })
    in?: Date[];

    @ApiPropertyOptional({ name: "notIn", type: Date, isArray: true })
    notIn?: Date[];
}

export class StringFieldComparisonBetweenTypeDto implements CommonFieldComparisonBetweenType<string> {
    @ApiPropertyOptional({ name: "lower", example: "some string" })
    lower: string;
    @ApiPropertyOptional({ name: "upper", example: "some string" })
    upper: string;
}

export class NumberFieldComparisonBetweenTypeDto implements CommonFieldComparisonBetweenType<number> {
    @ApiPropertyOptional({ name: "lower", example: "an integer" })
    lower: number;
    @ApiPropertyOptional({ name: "upper", example: "an integer" })
    upper: number;
}

export class StringFieldComparisonsDto implements StringFieldComparisons {
    @ApiPropertyOptional({ name: "eq", example: "some string" })
    eq?: string;
    @ApiPropertyOptional({ name: "neq", example: "some string" })
    neq?: string;
    @ApiPropertyOptional({ name: "gt", example: "some string" })
    gt?: string;
    @ApiPropertyOptional({ name: "gte", example: "some string" })
    gte?: string;
    @ApiPropertyOptional({ name: "lt", example: "some string" })
    lt?: string;
    @ApiPropertyOptional({ name: "lte", example: "some string" })
    lte?: string;
    @ApiPropertyOptional({ name: "iLike", example: "some string" })
    iLike?: string;
    @ApiPropertyOptional({ name: "like", example: "some string" })
    like?: string;
    @ApiPropertyOptional({ name: "notLike", example: "some string" })
    notLike?: string;
    @ApiPropertyOptional({ name: "notILike", example: "some string" })
    notILike?: string;
    @ApiPropertyOptional({ name: "in", example: ["value 1", "value 2"], isArray: true, type: String })
    in?: string[];
    @ApiPropertyOptional({ name: "is", oneOf: [{ example: true }, { example: false }, { example: null }] })
    is?: boolean | null;
    @ApiPropertyOptional({ name: "isNot", oneOf: [{ example: true }, { example: false }, { example: null }] })
    isNot?: boolean | null;
    @ApiPropertyOptional({ name: "notIn", example: ["value 1", "value 2"], isArray: true, type: String })
    notIn?: string[];
    @ApiPropertyOptional({ name: "between", example: { upper: "", lower: "" }, type: StringFieldComparisonBetweenTypeDto })
    between?: StringFieldComparisonBetweenTypeDto;
    @ApiPropertyOptional({ name: "notBetween", example: { upper: "", lower: "" }, type: StringFieldComparisonBetweenTypeDto })
    notBetween?: StringFieldComparisonBetweenTypeDto;
}

export class NumberFieldComparisonTypeDto implements CommonFieldComparisonType<number> {
    @ApiPropertyOptional({ name: "eq", example: 10 })
    eq?: number;

    @ApiPropertyOptional({ name: "gt", example: 10 })
    gt?: number;

    @ApiPropertyOptional({ name: "gte", example: 10 })
    gte?: number;

    @ApiPropertyOptional({ name: "in", example: [10, 22, 45], isArray: true, type: Number })
    in?: number[];

    @ApiPropertyOptional({ name: "is", example: null })
    is?: boolean;

    @ApiPropertyOptional({ name: "isNot", example: null })
    isNot?: boolean;

    @ApiPropertyOptional({ name: "lt", example: 10 })
    lt?: number;

    @ApiPropertyOptional({ name: "lte", example: 10 })
    lte?: number;

    @ApiPropertyOptional({ name: "neq", example: 10 })
    neq?: number;

    @ApiPropertyOptional({ name: "notIn", example: [33, 22, 55], isArray: true, type: Number })
    notIn?: number[];

    @ApiPropertyOptional({ name: "between", example: { lower: 10, upper: 20 } })
    between?: NumberFieldComparisonBetweenTypeDto;

    @ApiPropertyOptional({ name: "notBetween", example: { lower: 10, upper: 20 } })
    notBetween?: NumberFieldComparisonBetweenTypeDto;
}

export class imageComparisonsBetweenTypeDto implements CommonFieldComparisonBetweenType<{ url: string }> {
    @ApiPropertyOptional({ name: "lower", example: { url: "https://images/image-1.jpg" } })
    lower: { url: string; };
    @ApiPropertyOptional({ name: "upper", example: { url: "https://images/image-1.jpg" } })
    upper: { url: string; };
}

export class imageComparisonsTypeDto implements CommonFieldComparisonType<{ url: string }> {
    @ApiPropertyOptional({ name: "eq", example: { url: "https://images/image-1.jpg" } })
    eq?: { url: string; };

    @ApiPropertyOptional({ name: "neq", example: { url: "https://images/image-1.jpg" } })
    neq?: { url: string; };

    @ApiPropertyOptional({ name: "gt", example: { url: "https://images/image-1.jpg" } })
    gt?: { url: string; };

    @ApiPropertyOptional({ name: "gte", example: { url: "https://images/image-1.jpg" } })
    gte?: { url: string; };

    // @ApiPropertyOptional({ name: "in", example: [{ url: "https://images/image-1.jpg" }], isArray: true })
    // in?: { url: string; }[];

    @ApiPropertyOptional({ name: "is", example: null })
    is?: boolean | null;

    @ApiPropertyOptional({ name: "isNot", example: null })
    isNot?: boolean | null;

    // lt?: { url: string; };

    // lte?: { url: string; };

    // @ApiPropertyOptional({ name: "notIn", example: [{ url: "https://images/image-1.jpg" }], isArray: true })
    // notIn?: { url: string; }[];

    @ApiPropertyOptional({ name: "between", type: imageComparisonsBetweenTypeDto, example: { lower: { url: "https://images/image-1.jpg" }, upper: { url: "https://images/image-1.jpg" } } })
    between?: imageComparisonsBetweenTypeDto;

    @ApiPropertyOptional({ name: "notBetween", type: imageComparisonsBetweenTypeDto, example: { lower: { url: "https://images/image-1.jpg" }, upper: { url: "https://images/image-1.jpg" } } })
    notBetween?: CommonFieldComparisonBetweenType<{ url: string; }>;
}

export class BooleanFieldComparisonsDto implements BooleanFieldComparisons {
    @ApiPropertyOptional({ name: "is", example: true })
    is?: boolean | null;
    @ApiPropertyOptional({ name: "isNot", example: true })
    isNot?: boolean | null;
}