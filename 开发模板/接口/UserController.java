package com.ikey.springbootmodule.controller;

import com.alibaba.fastjson.JSONObject;
import com.ikey.springbootcommon.shiro.ShiroUser;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.service.UserService;
import com.ikey.springbootmodule.util.UserUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:05
 * @Description:  菜单
 */
@RestController
@RequestMapping("/user")
public class UserController{

    @Autowired
    private UserService userService;


    /**
     * 查询当前登录用户的信息
     * @return
     */
    @GetMapping("/query")
    public String query(){
        ShiroUser shiroUser = UserUtil.getShiroUser();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name",shiroUser.getName());
        jsonObject.put("headPortrait",shiroUser.getHeadPortrait());
        return JsonUtil.getSuccJson(jsonObject);
    }


}
