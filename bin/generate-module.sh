#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide a module name."
  exit 1
fi

MODULE_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]')
CLASS_NAME=$(echo "$MODULE_NAME" | sed -r 's/(^|_)([a-z])/\U\2/g')

MODULE_DIR="$(realpath "$(dirname "$0")/../src/modules/$MODULE_NAME")"

if [ -d "$MODULE_DIR" ]; then
  echo "Module $MODULE_NAME already exists."
  exit 1
fi

mkdir -p "$MODULE_DIR"

cat > "$MODULE_DIR/${MODULE_NAME}.controller.ts" <<EOL
import type { FastifyRequest } from "fastify";
import type {Get${CLASS_NAME}Request} from "./${MODULE_NAME}.types";
import ${CLASS_NAME}Service from "./${MODULE_NAME}.service";

export const get${CLASS_NAME}s = async (request: FastifyRequest<Get${CLASS_NAME}Request>) => {
    const { limit } = request.query;
    return ${CLASS_NAME}Service.get${CLASS_NAME}s(limit);
};
EOL

cat > "$MODULE_DIR/${MODULE_NAME}.schema.ts" <<EOL
import type { FastifySchema } from "fastify";

export const get${CLASS_NAME}sSchema: FastifySchema = {
    querystring: {
    		type: "object",
    		properties: {
    			limit: { type: "string" },
    		},
    	},
};
EOL

cat > "$MODULE_DIR/${MODULE_NAME}.types.ts" <<EOL
import type { RouteGenericInterface } from "fastify";

type Implements<T, U extends T> = U;

export type Get${CLASS_NAME}Request = Implements<
	RouteGenericInterface,
	{
		Querystring: {
		  limit: string;
    };
	}
>;
EOL

cat > "$MODULE_DIR/${MODULE_NAME}.service.ts" <<EOL
import ${CLASS_NAME} from "./${MODULE_NAME}.model";
import logger from "@utils/logger";
import type winston from "winston";

class ${CLASS_NAME}Service {
    private logger: winston.Logger;
    constructor() {
        this.logger = logger.child({ service: "${CLASS_NAME}" });
    }

    async get${CLASS_NAME}s(limit: string) {
        this.logger.info(\`get${CLASS_NAME}s called with limit: \${limit}\`);
        return ${CLASS_NAME}.find().limit(+limit).lean();
    }
}

export default new ${CLASS_NAME}Service();
EOL

cat > "$MODULE_DIR/${MODULE_NAME}.model.ts" <<EOL
import { model, Schema } from "mongoose";

export interface I${CLASS_NAME} {
    _id: string;
    // Add other fields here
    createdAt: Date;
}


const ${CLASS_NAME}Schema = new Schema<I${CLASS_NAME}>(
    {
        createdAt: {
            type: Date,
            default: Date.now
        },
    },
    { versionKey: false },
);

export default model<I${CLASS_NAME}>("${CLASS_NAME}", ${CLASS_NAME}Schema);

EOL

cat > "$MODULE_DIR/${MODULE_NAME}.constants.ts" <<EOL
export const SOME_CONSTANT = "some value";

EOL

cat > "$MODULE_DIR/${MODULE_NAME}.routes.ts" <<EOL
import type { FastifyInstance } from "fastify";
import { get${CLASS_NAME}s } from "./${MODULE_NAME}.controller";
import { get${CLASS_NAME}sSchema } from "./${MODULE_NAME}.schema";

async function ${MODULE_NAME}Routes(server: FastifyInstance) {
    server.get(
        "/",
        {
            schema: get${CLASS_NAME}sSchema
        },
        get${CLASS_NAME}s,
    );
}

export default ${MODULE_NAME}Routes;

EOL

echo "Module $MODULE_NAME created successfully in $MODULE_DIR."
