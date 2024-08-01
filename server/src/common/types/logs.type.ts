import { type LogLevel as LogLevelEnum } from "../../common/enums/enums";

type LogLevel = (typeof LogLevelEnum)[keyof typeof LogLevelEnum];

export { LogLevel };
