import "dotenv/config"
import { z } from "zod"

const configSchema = z.object({
  PORT:z.coerce.number({error:"PORT is missing"}).default(5000),
  DATABASE_URI:z.string({error:"DATABASE_URL_DEV is missing"}),
  JWT_SECRET:z.string({error:"JWT_SECRET is missing"}),
})

function validate(){
  const { success, data, error} = configSchema.safeParse(process.env)
  if(!success){
    const errors = Object.values(z.flattenError(error).fieldErrors).flat()
    throw Error(errors[0])
  }

  return data
}

export const config = validate()
