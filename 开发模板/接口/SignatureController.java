package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Dict;
import com.ikey.springbootmodule.entity.Signature;
import com.ikey.springbootmodule.entity.UserSignature;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.SignatureService;
import com.ikey.springbootmodule.service.UserSignatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author laughing
 * @date 2018-09-25
 * @decription 电子签名管理
 */
@RestController
@RequestMapping("/signature")
public class SignatureController {

    @Autowired
    private SignatureService signatureService;
    @Autowired
    private UserSignatureService userSignatureService;

    /**
     * 电子签名的管理列表
     * @return
     */
   // @RequiresPermissions("sys:dict:view")
    @RequestMapping(value = {"list", ""})
    public String list(@RequestBody(required=false) Page<Map<String,Object>> page) {
        if(page==null){
            page = new Page<Map<String,Object>>();
        }
        Page<Map<String,Object>> pageObj = signatureService.serchPage(page);
        return JsonUtil.getSuccJson(pageObj);
    }


    /**
     * 获取未被授权的电子签名列表
     * @param name
     * @return
     */
    @GetMapping(value = "chooseList")
    public String chooseList(String name){
       List<Map<String,Object>> list = signatureService.chooseList(name);
       return JsonUtil.getSuccJson(list);
    }


    /**
     * 添加签名
     * @param signature
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @RequestMapping(value = "add")
    public String add(@RequestBody Signature signature) throws GlobalException {
        boolean result = signatureService.insert(signature);
        if(!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(signature);
    }

    /**
     * 电子签名授权
     * @param userSignature
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @RequestMapping(value = "userSignature")
    public String update(@RequestBody UserSignature userSignature) throws GlobalException {
        boolean result = userSignatureService.insert(userSignature);
        if(!result){
            throw new GlobalException(ExceptionType.E0003);
        }
        //修改签名状态为已授权
        Signature signature = signatureService.selectById(userSignature.getSignatureId());
        signature.setSignatureStatus("auth");
        signatureService.updateById(signature);
        return JsonUtil.getSuccJson(null);
    }


    /**
     * 删除签名
     * @param signatureId
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @GetMapping(value = "delete")
    public String delete(@RequestParam String signatureId) {
        Signature signature = signatureService.selectById(signatureId);
        signature.setDelFlag("1");
        boolean result = signatureService.updateById(signature);
        if(!result){
            throw new GlobalException(ExceptionType.E0004);
        }
        return JsonUtil.getSuccJson(null);
    }

}
