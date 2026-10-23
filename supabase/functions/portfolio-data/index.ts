const allowed=new Set(["page_views","analytics_events","identified_visitors","contact_submissions","conversation_messages","rpc/take_rate_limit","rpc/append_portfolio_message"]);
Deno.serve(async(req:Request)=>{
 const headers={"Content-Type":"application/json","Cache-Control":"private, no-store"};
 const fail=(status:number,error:string)=>new Response(JSON.stringify({error}),{status,headers});
 try{
 if(req.method!=="POST")return fail(405,"Method not allowed");
 const token=req.headers.get("Authorization")?.replace(/^Bearer /,"")||"";
 if(!/^[A-Za-z0-9_-]{43}$/.test(token))return fail(401,"Unauthorized");
 const hash=[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token)))].map(x=>x.toString(16).padStart(2,"0")).join("");
 const base=Deno.env.get("SUPABASE_URL")!,key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
 const privileged={apikey:key,Authorization:"Bearer "+key};
 const verification=await fetch(base+"/rest/v1/portfolio_server_credentials?key_hash=eq."+hash+"&select=name&revoked=eq.false",{headers:privileged});
 if(!verification.ok||!(await verification.json()).length)return fail(401,"Unauthorized");
 const reader=req.body?.getReader();if(!reader)return fail(400,"Body required");const chunks:Uint8Array[]=[];let length=0;
 for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>20000){await reader.cancel();return fail(413,"Request too large");}chunks.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
 const payload=JSON.parse(new TextDecoder().decode(bytes));
 if(typeof payload.path!=="string"||payload.path.length>6000||!["GET","HEAD","POST","PATCH"].includes(payload.method))return fail(400,"Invalid request");
 const url=new URL(base+"/rest/v1/"+payload.path);
 const resource=url.pathname.replace(/^\/rest\/v1\//,"");
 if(url.origin!==new URL(base).origin||!allowed.has(resource)||payload.path.split("?")[0]!==resource)return fail(403,"Operation not allowed");
 if(resource.startsWith("rpc/")&&payload.method!=="POST")return fail(403,"Operation not allowed");
 if(!resource.startsWith("rpc/")&&payload.method==="PATCH"&&resource!=="contact_submissions")return fail(403,"Operation not allowed");
 // Reject embedded relationship queries and schema-switching parameters.
 if([...url.searchParams.keys()].some(k=>! /^[a-zA-Z0-9_.-]+$/.test(k))||/[():]/.test(url.searchParams.get("select")||""))return fail(400,"Invalid query");
 const forwarded:Record<string,string>={...privileged};
 for(const name of ["accept","content-type","prefer","range","range-unit"]){const value=payload.headers?.[name];if(typeof value==="string"&&value.length<1000)forwarded[name]=value;}
 const upstream=await fetch(url,{method:payload.method,headers:forwarded,body:["GET","HEAD"].includes(payload.method)?undefined:payload.body||undefined});
 const responseHeaders:Record<string,string>={"Cache-Control":"private, no-store"};
 for(const name of ["content-type","content-range","preference-applied"]){const value=upstream.headers.get(name);if(value)responseHeaders[name]=value;}
 return new Response(upstream.body,{status:upstream.status,headers:responseHeaders});
 }catch{return fail(503,"Portfolio storage is temporarily unavailable");}
});
