import { defineStore } from 'pinia';
import localforage from 'localforage'
import { useSocketStore } from './socket'

export const useDBStore = defineStore('db', {
    state: () => ({
        database: <LocalForage | null>(null)
    }),
    actions: {
        initDB(storeName: string) {
            console.log('initDB',storeName)
            this.database = localforage.createInstance({
                driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
                name: location.hostname,
                version: 1.0,
                // size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
                storeName, // Should be alphanumeric, with underscores.
                description: '用户信息存储'
            })
            this.database?.getItem('User_Message').then((data:any) => {
                useSocketStore().userMessageMap = data || new Map()
            })
            this.database?.getItem('Room_Message').then((data:any) => {
                useSocketStore().roomMessageMap = data || new Map()
            })
        }
    }
})

