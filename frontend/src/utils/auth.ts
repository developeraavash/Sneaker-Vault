import API from ".";

// src/api/auth.ts
export async function checkAuthentication(): Promise<boolean> {
    try {
        const token = window.localStorage.getItem('token') || ''
        const res = await API("/auth", {
            headers: { Authorization: `Bearer ${token}` },
          });
        if(res.status===200){
            return true
        }
        else return false
    } catch (error) {
        return false
    }
  }
  