package com.ikey.springbootmodule.controller;

import com.alibaba.fastjson.JSONObject;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootcommon.util.MD5Util;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @Auther: laughing
 * @Date: 2018-9-11 15:49
 * @Description: 权限
 */
@Controller
public class ShiroController {

    /**
     * 登录
     * @param loginName
     * @param password
     * @return
     */
    @PostMapping(value = "/ajaxLogin")
    @ResponseBody
    public String ajaxLogin(@RequestParam(required = true)String loginName,@RequestParam(required = true)String password){
        JSONObject jsonObject = new JSONObject();
        String result = "";
        Subject subject = SecurityUtils.getSubject();
        //密码加密MD5
        password = MD5Util.encryptPassword(password);
        UsernamePasswordToken token = new UsernamePasswordToken(loginName, password);
        try {
            subject.login(token);
            jsonObject.put("token", subject.getSession().getId());
            result = JsonUtil.getSuccJson(jsonObject);
        } catch (IncorrectCredentialsException e) {
            result = JsonUtil.getErrJson(ExceptionType.E0005);
        } catch (LockedAccountException e) {
            result = JsonUtil.getErrJson(ExceptionType.E0006);
        } catch (AuthenticationException e) {
            result = JsonUtil.getErrJson(ExceptionType.E0007);
        } catch (Exception e) {
            result = JsonUtil.getErrJson(ExceptionType.E9999);
        }
        return result;
    }

}
