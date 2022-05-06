import { RequestComand } from "../models/request-comand.model"
import { UserComand } from "../models/user-comand.model"
import { Users } from "../models/users.model"

export interface IAdminService{
    confirmManager(id: number, reason: string):Promise<Users> 

    declineManager(id: number, reason: string):Promise<Users>
 
    getManagerById(id: number):Promise<Users>

    getManagers(userLimit:number, offsetStart:number):Promise<Users[]> 

    getUserById(id: number):Promise<Users>

    confirmMemberToAnTeam(userId:number, comandId: number):Promise<UserComand>

    declineToAnotherTeam(userId:number):Promise<string>
      
    allQueue(userLimit:number, offsetStart:number):Promise<RequestComand[] >

    getmembers(comandId:number,userLimit:number, offsetStart:number):Promise<UserComand[]>

    deleteUserFromTeam(userId:number):Promise<string>

    memberToTeam(reqId:number, status:string):Promise<string>

    getMember(id:number):Promise<Users>
}