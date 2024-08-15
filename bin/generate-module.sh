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
import type {GeneratedRequestRequest} from "./test.types";
import ${CLASS_NAME}Service from "./${MODULE_NAME}.service";

export const generated = async (request: FastifyRequest<GeneratedRequestRequest>) => {
    const { test } = request.body;
    const data = await ${CLASS_NAME}Service.getSomething(test);
    return data;
};
EOL

cat > "$MODULE_DIR/${MODULE_NAME}.schema.ts" <<EOL
import type { FastifySchema } from "fastify";

export const generatedSchema: FastifySchema = {
    body: {
    		type: "object",
    		properties: {
    			test: { type: "string" },
    		},
    	},
};
EOL

cat > "$MODULE_DIR/${MODULE_NAME}.types.ts" <<EOL
export interface GeneratedRequestBody {
	test: string;
}

export interface GeneratedRequestRequest {
	Body: GeneratedRequestBody;
}

EOL

cat > "$MODULE_DIR/${MODULE_NAME}.service.ts" <<EOL
import ${CLASS_NAME} from "./${MODULE_NAME}.model";
import logger from "@utils/logger";

class ${CLASS_NAME}Service {
    private logger;
    constructor() {
        this.logger = logger.child({ service: "${MODULE_NAME}" });
    }

    async getSomething(test: string) {
        this.logger.info(test);
        return await Test.find().lean();
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
import { generated } from "./${MODULE_NAME}.controller";

async function ${MODULE_NAME}Routes(server: FastifyInstance) {
    server.get(
        "/",
        {
            schema: generatedSchema
        },
        generated,
    );
}

export default ${MODULE_NAME}Routes;

EOL

echo "Module $MODULE_NAME created successfully in $MODULE_DIR."
