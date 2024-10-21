
import { Injectable } from "@nestjs/common"

@Injectable()
export class MeliPayamakService {

    async sendMessage(params: {
        username: string;
        password: string;
        to: string;
        from: string;
        text: string;
        isFlash: boolean;
    }): Promise<"success" | "failed" | "internal-error"> {
        try {
            const res = await fetch(`https://api.payamak-panel.com/post/Send.asmx/SendSimpleSMS2?username=${params.username}&password=${params.password}&to=${params.to}&from=${params.from}&text=${params.text}&isflash=${params.isFlash}&bodyId=247108`)

            console.log(res.statusText)

            if (res.ok) {
                return "success"
            }
            return "failed"
        } catch (error) {
            console.log(error)
            return "internal-error"
        }
    }

}